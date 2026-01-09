import { Injectable, InternalServerErrorException, StreamableFile } from '@nestjs/common';
import { extension } from 'mime-types';
import * as sharp from 'sharp';
import { join } from 'path';
import { v7 as uuidv7 } from 'uuid';
import * as fs from 'fs';
import { existsSync, promises as fsp, mkdirSync } from 'fs';
import { homedir } from 'os';

import { DefaultErrorCodes } from 'src/error_codes/default_error_codes';
import { ReadFilesDto } from '../files/dto/read-files.dto';
import { StorageService } from 'src/storage/storage.service';
import { FilesService } from '../files/files.service';
import { UploadFileDto } from './dtos/upload_file.dto';
import { Access } from './dtos/permission.dto';
import DataObject from 'src/model/data_object';

// Define a type for the data our helper method will process
type FileInput = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

@Injectable()
export class UploadService {
  // This is your physical storage location, the "warehouse"
  private readonly storagePath = join(homedir(), 'object-storage');

  constructor(
    private readonly fileService: FilesService,
    private readonly storageService: StorageService, // Inject StorageService
  ) {
    if (!existsSync(this.storagePath)) {
      mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Handles a file uploaded via multipart/form-data.
   * Assumes Multer is configured for in-memory storage (file.buffer is available).
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ): Promise<ReadFilesDto> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException(
        'File buffer is missing. Ensure Multer is configured for in-memory storage.',
      );
    }
    return await this.processAndSave(file, uploadFileDto);
  }

  /**
   * Private helper that contains the core logic.
   */
  private async processAndSave(
    file: FileInput,
    dto: UploadFileDto,
  ): Promise<ReadFilesDto> {
    const isImage = file.mimetype.startsWith('image/');
    const variants = {}; // To store paths of different file versions

    // Always save the original file first
    const originalFileUUID = uuidv7();
    await this.storageService.writeFile(originalFileUUID, file.buffer);
    variants['original'] = originalFileUUID; // <-- STORE THE ORIGINAL'S ID
    const mime = isImage ? 'image/webp' : file.mimetype;
    const ext = isImage ? 'webp' : extension(mime);
    if (isImage) {
      try {
        // ... (image processing logic is the same)
        const image = sharp(file.buffer);

        const webpBuffer = await image.webp({ quality: 90 }).toBuffer();
        const webpUUID = `${uuidv7()}.webp`;
        await this.storageService.writeFile(webpUUID, webpBuffer);
        variants['webp'] = webpUUID;

        const thumbBuffer = await image
          .resize({
            width: 200,
            withoutEnlargement: true,
          } as sharp.ResizeOptions)
          .webp({ quality: 90 })
          .toBuffer();
        const thumbUUID = webpUUID.replace('.webp', '_thumb.webp');
        await this.storageService.writeFile(thumbUUID, thumbBuffer);
        variants['thumbnail'] = thumbUUID;
      } catch (error) {
        // ... error handling
        throw new InternalServerErrorException(
          DefaultErrorCodes.IMAGE_PROCESSING_FAILED,
        );
      }
    }

    // --- Metadata Database Record ---
    // Now create the single record in your database that points to all the physical files.
    const createData = {
      ...dto,
      mime_type: mime,
      size: file.buffer.length,
      variants: variants, // The JSON object containing paths to other versions
    };

    const date = new Date();
    return (await this.fileService.create({
      parent: null,
      linked: false,
      other: createData,
      ext,
      size: file.buffer.length,
      linked_to: null,
      permissions: {
        any: [Access.READ],
      },
      is_directory: 0,
      created_at: date,
      created_by: this.fileService.getCurrentUserId() ?? null,
      updated_at: date,
      updated_by: this.fileService.getCurrentUserId() ?? null,
    })) as ReadFilesDto; // Now matches CreateFilesDto structure
  }

  async downloadFile(
    id: string,
    thumb?: boolean,
  ): Promise<{ file: ReadFilesDto; fileSize: number; stream: fs.ReadStream }> {
    const file = await this.fileService.findOne(id);
    if (!file) {
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);
    }
    if (!file.other.variants)
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);
    const variants: DataObject = file.other.variants as DataObject;
    const filePath = join(
      this.storagePath,
      (variants && thumb ? variants.thumbnail : variants.webp) as string,
    );
    if (!existsSync(filePath)) {
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);
    }
    const stats = fs.statSync(filePath); // Get file stats
    // From local disk path
    const stream = fs.createReadStream(String(filePath));
    return { file, fileSize: stats.size, stream };
  }

  async downloadFileWithMeta(
    id: string,
    thumb?: boolean,
  ): Promise<{
    file: ReadFilesDto;
    stream: StreamableFile;
    meta: { size: number; mime: string };
  }> {
    const file = await this.fileService.findOne(id);
    if (!file)
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);
    if (!file.other?.variants)
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);

    const variants: any = file.other.variants;
    const chosen = variants && thumb ? variants.thumbnail : variants.webp;
    const filePath = join(this.storagePath, chosen);

    if (!existsSync(filePath)) {
      throw new InternalServerErrorException(DefaultErrorCodes.FILE_NOT_FOUND);
    }
    const stat = await fsp.stat(filePath);
    const mime = String(file.other.mime_type || 'application/octet-stream');
    const nodeStream = fs.createReadStream(filePath);
    return {
      file,
      stream: new StreamableFile(nodeStream), // controller adds headers/options
      meta: { size: stat.size, mime },
    };
  }
}

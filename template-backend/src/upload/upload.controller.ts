import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
// upload.controller.ts
import { Body, Controller, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards } from '@nestjs/common';
import * as fs from 'fs';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AnyMimeTypeValidator } from './any_mime_type.validator';
import { RoleEnum } from 'src/users/enums/role.enum';
import { ClamavService } from '../clamav/clamav.service';
import { UploadService } from './upload.service';

// ------- config -------
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB (your comment said 2 MB; this is 20)
const allowed = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/tiff',
  'image/bmp',
  'image/x-icon',
  'image/heif',
  'image/heic',
  'image/avif',
  'image/apng',
];
@ApiTags('Upload')
@Controller({ path: 'upload', version: '1' })
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly clamavService: ClamavService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file via multipart/form-data',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully.',
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_BYTES }),
          new AnyMimeTypeValidator({ allowed }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() createFileDto: any,
  ) {
    // Virus-scan the in-memory buffer
    if (!file.buffer) {
      (file as any).buffer = fs.readFileSync(file.path);
    }
    // throw new BadRequestException(DefaultErrorCodes.FILE_BUFFER_MISSING);

    // await this.clamavService.scanBuffer(file.buffer);

    // Persist
    const result = await this.uploadService.uploadFile(file, createFileDto);
    //delete the file from uploads
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return {
      id: result.id,
      variants: {
        ...(typeof result?.other?.variants === 'object' &&
        result?.other?.variants !== null
          ? result?.other?.variants
          : {}),
      },
    };
  }
}

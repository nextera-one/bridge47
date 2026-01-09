// src/storage/storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { existsSync, promises as fsp, mkdirSync } from 'fs';
import { homedir } from 'os';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  public readonly storagePath = join(homedir(), 'object-storage');

  constructor() {
    if (!existsSync(this.storagePath)) {
      mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Writes a file to the storage directory.
   * @param filename - The unique name for the file (e.g., a UUID).
   * @param buffer - The file content.
   */
  async writeFile(filename: string, buffer: Buffer): Promise<void> {
    const filePath = join(this.storagePath, filename);
    await fsp.writeFile(filePath, buffer);
  }

  /**
   * Deletes a single file from the storage directory.
   * @param filename - The unique name of the file to delete.
   */
  async deleteFile(filename: string): Promise<void> {
    if (!filename) return; // Ignore if filename is null or empty

    const filePath = join(this.storagePath, filename);
    try {
      if (existsSync(filePath)) {
        await fsp.unlink(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file ${filePath}`, error);
    }
  }

  /**
   * Deletes all file variants stored in the variants object.
   * @param variants - An object where keys are variant names and values are filenames.
   */
  async deleteVariants(variants: Record<string, string>): Promise<void> {
    if (!variants || typeof variants !== 'object') return;

    this.logger.log(`Deleting variants: ${JSON.stringify(variants)}`);
    for (const filename of Object.values(variants)) {
      await this.deleteFile(filename);
    }
  }
}

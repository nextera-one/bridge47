import { FileValidator } from '@nestjs/common';

export class AnyMimeTypeValidator extends FileValidator<{ allowed: string[] }> {
  isValid(file?: Express.Multer.File): boolean {
    const mt = (file?.mimetype || '').split(';')[0].trim().toLowerCase();
    return this.validationOptions.allowed
      .map((s) => s.toLowerCase())
      .includes(mt);
  }
  buildErrorMessage(file: Express.Multer.File): string {
    const got = (file?.mimetype || '').split(';')[0].trim();
    return `UNSUPPORTED_FILE_TYPE (got ${got})`;
  }
}

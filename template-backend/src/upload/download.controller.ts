import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// download.controller.ts
import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { FileCacheInterceptor, FileResponse } from 'src/common/interceptors/file-cache.interceptor';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BaseController } from 'src/base/base.controller';
import { UploadService } from './upload.service';

@ApiTags('Download')
@Controller({ path: 'download', version: '1' })
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DownloadController extends BaseController {
  constructor(private readonly uploadService: UploadService) {
    super();
  }

  /**
   * GET /api/v1/download/:id
   * Serves a file with robust caching, handled by the FileCacheInterceptor.
   */
  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileCacheInterceptor) // <-- Apply the interceptor here!
  async downloadFile(
    @Param('id') id: string,
    @Query('download') download: string,
    @Query('thumb') thumb: string,
  ): Promise<FileResponse> {
    // <-- Return type is now our custom interface
    const isThumbnail = thumb?.toLowerCase() === 'true';

    // 1. Get the file data from the service
    const { file, fileSize, stream } = await this.uploadService.downloadFile(
      id,
      isThumbnail,
    );

    // 2. Determine disposition and filename
    const disposition = download ? 'attachment' : 'inline';
    const filename =
      file?.name !== undefined && file?.name !== null
        ? String(file.name)
        : `file.${file?.ext !== undefined && file?.ext !== null ? String(file.ext) : 'bin'}`;

    // 3. Return a plain object. The interceptor will do the rest.
    return {
      file,
      fileSize,
      stream,
      disposition,
      filename,
    };
  }
}

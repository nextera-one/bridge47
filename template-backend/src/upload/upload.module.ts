import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Files } from '../files/entities/files.entity';
import { StorageService } from 'src/storage/storage.service';
import { ClamavModule } from '../clamav/clamav.module';
import { FilesService } from '../files/files.service';
import { DownloadController } from './download.controller';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), ClamavModule],
  controllers: [UploadController, DownloadController],
  providers: [FilesService, UploadService, StorageService],
})
export class UploadModule {}

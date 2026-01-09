import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorCodes } from './entities/error_codes.entity';
import { ErrorCodesController } from './error_codes.controller';
import { ErrorCodesService } from './error_codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorCodes])],
  controllers: [ErrorCodesController],
  providers: [ErrorCodesService],
  exports: [ErrorCodesService],
})
export class ErrorCodesModule {}

import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorCodes } from '../error_codes/entities/error_codes.entity';
import { ErrorCodesCacheService } from '../error_codes/error_codes_cache.service';
import { ErrorTranslations } from '../error_translations/entities/error_translations.entity';
import { ErrorTranslationsCacheService } from '../error_translations/error_translations_cache.service';
import { ReportedErrors } from '../reported_errors/entities/reported_errors.entity';
import { Errors } from './entities/errors.entity';
import { ErrorHandlingService } from './error-handling.service';
import { ErrorsController } from './errors.controller';
import { ErrorsService } from './errors.service';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Errors,
      ErrorCodes,
      ErrorTranslations,
      ReportedErrors,
    ]),
  ],
  controllers: [ErrorsController],
  providers: [
    ErrorsService,
    ErrorHandlingService,
    ErrorCodesCacheService,
    ErrorTranslationsCacheService,
  ],
  exports: [ErrorsService, ErrorHandlingService],
})
export class ErrorsModule {}

import { InjectRepository } from '@nestjs/typeorm';
// src/error-handling/error-handling.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ErrorTranslationsCacheService } from '../error_translations/error_translations_cache.service';
import { ReportedErrors } from '../reported_errors/entities/reported_errors.entity';
import { ErrorCodesCacheService } from '../error_codes/error_codes_cache.service';
import { DefaultErrorCodes } from '../error_codes/default_error_codes';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import DataObject from '../model/data_object';
import { IErrorDetails } from './dto/error.types';

@Injectable()
export class ErrorHandlingService {
  constructor(
    // Injected cache services replace the direct repositories for errors and translations
    private readonly errorCache: ErrorCodesCacheService,
    private readonly translationCache: ErrorTranslationsCacheService,

    // The repository for writing reported errors is kept
    @InjectRepository(ReportedErrors)
    private readonly reportedErrorsRepository: Repository<ReportedErrors>,
  ) {}

  async getErrorDetails(
    errorCode: string,
    lang: string = 'en',
  ): Promise<ApiResponseDto<IErrorDetails>> {
    // 1. Fetch the master error from the cache (very fast)
    const masterError =
      (await this.errorCache.get(errorCode)) ||
      DefaultErrorCodes.get(errorCode) ||
      DefaultErrorCodes.get(DefaultErrorCodes.NOT_FOUND);

    if (!masterError) {
      // Throw a standard exception if the code is invalid. The exception filter will handle it.
      throw new HttpException(errorCode, HttpStatus.BAD_REQUEST);
    }

    // 2. Fetch the translation from its cache (also very fast)
    // The default 'en' message is already in masterError.
    const translation = await this.translationCache.get(masterError.id, lang);

    return new ApiResponseDto({
      message: translation ? translation.message : masterError.default_message, //
      statusCode: masterError.http_status_code, //
      is_reportable: masterError.is_reportable, //
      success: false,
      data: null,
      error: masterError,
      timestamp: Date.now(),
    });
  }

  /**
   * This function remains unchanged as it deals with writing new data, not reading.
   */
  async reportError(
    userId: string,
    errorCode: string,
    path: string,
    comment: string,
  ): Promise<ReportedErrors> {
    const insertResult = await this.reportedErrorsRepository.save({
      user: userId, //
      error_code: errorCode, //
      path, //
      user_comment: comment, //
    });
    return insertResult; //
  }
}

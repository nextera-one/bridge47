// src/shared/filters/all-exceptions.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { ErrorHandlingService } from '../../errors/error-handling.service';
import { DefaultErrorCodes } from 'src/error_codes/default_error_codes';
import { IErrorDetails } from 'src/errors/dto/error.types';
import { ApiResponseDto } from '../dto/api-response.dto';
import DtoUtil from '../utils/dto.util';

// Renamed for clarity
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // Use a dedicated logger for the filter
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;
    const lang = request.headers['accept-language']?.split(',')[0] || 'en';

    // Log the raw exception for debugging
    this.logger.error(`Exception caught for path ${path}:`, exception);

    let statusCode: HttpStatus;
    let appErrorCode: string;
    let errorDetails: IErrorDetails;

    // --- 1. Determine Status and Error Code from Exception Type ---
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      appErrorCode = exception.message;

      // Handle special 404 cases (redirection, docs page)
      if (statusCode === HttpStatus.NOT_FOUND) {
        if (['', '/', '/api', '/api/v1'].includes(path)) {
          return response.redirect('/api/v1/docs'); // Redirect to docs for convenience
        }
        if (request.method === 'GET' && path.includes('/api/v1/docs')) {
          // Assuming you have a 404.hbs or similar view file
          return response.status(HttpStatus.NOT_FOUND).render('404');
        }
      }
    } else if (exception instanceof QueryFailedError) {
      // Default to DATABASE_ERROR and let the service determine the final status
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const driverError = exception.driverError as any;
      // Map specific DB errors if needed, otherwise use a generic code
      appErrorCode = driverError.code || DefaultErrorCodes.DATABASE_ERROR;
    } else {
      // Fallback for all other unhandled errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      appErrorCode =
        (exception as any).message || DefaultErrorCodes.INTERNAL_SERVER_ERROR;
    }

    // --- 2. Get Standardized Error Details ---
    // The service provides a consistent structure regardless of the original error
    try {
      const errorDetailsResponse =
        await this.errorHandlingService.getErrorDetails(appErrorCode, lang);
      errorDetails = errorDetailsResponse.data;
      // Let the details from our service be the source of truth for the final status code
      statusCode = errorDetails.statusCode;
    } catch (lookupError) {
      // Fallback if the error code itself doesn't exist in our service
      this.logger.error(
        `Failed to look up error code: ${appErrorCode}`,
        lookupError,
      );
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorDetails = {
        statusCode,
        message: 'An unexpected internal error occurred.',
        error: {
          code: DefaultErrorCodes.INTERNAL_SERVER_ERROR,
          http_status_code: statusCode,
          is_reportable: true,
          default_message: 'An unexpected internal error occurred.',
          default_description: 'The error code could not be processed.',
        },
        is_reportable: true,
        success: false,
        data: null,
        timestamp: Date.now(),
      };
    }

    // --- 3. Construct and Send the Final API Response ---
    const apiResponse = new ApiResponseDto({
      success: false,
      statusCode: statusCode,
      message: errorDetails.message,
      data: null,
      error: {
        message: errorDetails.message,
        description: errorDetails.error?.default_description,
        code: appErrorCode,
        path: path,
        timestamp: new Date().toISOString(),
      },
      is_reportable: errorDetails.is_reportable,
      timestamp: Date.now(),
    });

    response.status(statusCode).json(DtoUtil.cleanObject(apiResponse));
  }
}

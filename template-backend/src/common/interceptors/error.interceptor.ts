import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, Observable, throwError } from 'rxjs';

import { CreateErrorsDto } from '../../errors/dto/create-errors.dto';
import { ErrorsService } from '../../errors/errors.service';
import CurrentUserModel from '../../model/current_user.model';
import DtoUtil from '../utils/dto.util';
import StringUtil from '../utils/string.util';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(
    private readonly errorService: ErrorsService,
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
  ) {}

  // Intercept method to capture and handle errors.
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Log the error using the error logging service

        // Retrieve the current HTTP request
        const request = context.switchToHttp().getRequest();

        // If there's no request (e.g., when not handling an HTTP request), re-throw the error.
        if (!request) {
          return throwError(() => error);
        }

        // Generate a reference number for the error.
        const ref = StringUtil.generateReferenceNumber();

        // Add the reference number to the error object.
        error.ref = ref;

        // Prepare error DTO (Data Transfer Object) for logging
        const errorDto = {
          code: error.code || 0,
          message: error.message || JSON.stringify(error),
          ref,
          other: JSON.stringify({
            error,
            request: {
              url: request.url,
              method: request.method,
              headers: request.headers,
              body: request.body,
              user: request['user'],
            },
          }),
        } as CreateErrorsDto;

        // Get user information from the request (if available)
        let user = request['user'] as CurrentUserModel;

        // If user information is not available, create a default user.
        if (!user) {
          user = {
            id: this.configService.get<string>('SYSTEM_ID'),
          } as CurrentUserModel;
        }

        // Override audit columns in the error DTO with user information.
        DtoUtil.overrideAuditColumns(errorDto, user, false);

        // Create an error log entry using the error service.
        this.errorService.create(errorDto);

        // Re-throw the error using the new throwError syntax.
        return throwError(() => error);
      }),
    );
  }
}

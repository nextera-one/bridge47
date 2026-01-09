// src/shared/interceptors/transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T> | T | StreamableFile>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseDto<T> | T | StreamableFile> {
    const now = Date.now();

    return next.handle().pipe(
      map((data: any) => {
        // 1) If the controller returns a StreamableFile directly -> pass through
        if (data instanceof StreamableFile) {
          return data;
        }

        // 2) If the controller returns an object that *contains* a StreamableFile -> pass through the stream
        if (data?.stream instanceof StreamableFile) {
          // If you want to set headers (filename, mime) do it in the controller,
          // not here (headers may be needed before the body is sent).
          return data.stream as StreamableFile;
        }

        // 3) If the controller already shaped an ApiResponseDto, don't double-wrap
        if (data?.success === true && 'statusCode' in data && 'data' in data) {
          return data;
        }

        // 4) Normal JSON response -> wrap
        return new ApiResponseDto({
          success: true,
          statusCode: 200,
          message: 'Success',
          data,
          error: {},
          is_reportable: false,
          timestamp: now,
        });
      }),
    );
  }
}

import { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces';
// src/common/interceptors/file-cache.interceptor.ts
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { ReadStream } from 'fs';

// Define the shape of the data our controller should return
export interface FileResponse {
  file: any; // Your file entity/object
  fileSize: number;
  stream: ReadStream;
  disposition: 'inline' | 'attachment';
  filename: string;
}

@Injectable()
export class FileCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data: FileResponse) => {
        // The controller MUST return an object matching the FileResponse interface
        if (!data || !data.file || !data.stream) {
          // If the data is not what we expect, pass it through without caching.
          return data;
        }

        const { file, fileSize, stream, disposition, filename } = data;
        const mimetype = file?.other?.mime_type || 'application/octet-stream';

        // ---------- Build cache validators ----------
        const lastModifiedMs: number =
          (file?.other?.updated_at &&
            new Date(file.other.updated_at).getTime()) ||
          (file?.updated_at && new Date(file.updated_at).getTime()) ||
          (file?.mtime && new Date(file.mtime).getTime()) ||
          Date.now();

        const lastModifiedHttp = new Date(lastModifiedMs).toUTCString();

        const etag = createHash('sha1')
          .update(
            [
              'v1',
              file.id, // Assuming the file object has an ID
              String(fileSize ?? ''),
              String(lastModifiedMs),
            ].join(':'),
          )
          .digest('hex');

        // ---------- Conditional request handling (304) ----------
        const ifNoneMatch = req.headers['if-none-match'];
        const ifModifiedSince = req.headers['if-modified-since'];

        if (
          ifNoneMatch &&
          ifNoneMatch
            .split(',')
            .map((s) => s.trim().replace(/^W\//, '').replace(/^"|"$/g, ''))
            .includes(etag)
        ) {
          res.status(HttpStatus.NOT_MODIFIED).end();
          return; // Short-circuit and end the response
        }

        if (ifModifiedSince) {
          const since = new Date(ifModifiedSince).getTime();
          if (!Number.isNaN(since) && lastModifiedMs <= since) {
            res.status(HttpStatus.NOT_MODIFIED).end();
            return;
          }
        }

        // ---------- Set Caching and Streaming Headers ----------
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('ETag', `"${etag}"`); // ETags should be quoted
        res.setHeader('Last-Modified', lastModifiedHttp);
        res.setHeader('X-Accel-Buffering', 'no');

        // ---------- Return the StreamableFile ----------
        // The interceptor's job is to transform the data into the final response format.
        return new StreamableFile(stream, {
          type: mimetype,
          disposition: `${disposition}; filename="${filename}"`,
          length: fileSize,
        } as StreamableFileOptions);
      }),
    );
  }
}

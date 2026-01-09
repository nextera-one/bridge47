import { HttpException, HttpExceptionOptions } from '@nestjs/common';

/**
 * Defines an HTTP exception for *Bad Request* type errors.
 *
 * @see [Built-in HTTP exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
 *
 * @publicApi
 */
export declare class InactiveException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  );
}

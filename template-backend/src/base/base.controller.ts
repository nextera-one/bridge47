// src/common/abstract.controller.ts
import { All, Header, HttpCode, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

export abstract class BaseController {
  /**
   * Catch any HTTP method not explicitly declared in the subclass
   * and return a 405 with an Allow header.
   */
  @All('*path')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  @Header('Content-Type', 'application/json')
  rejectOthers(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response, // Use passthrough for setting headers
  ) {
    res.setHeader('Allow', this.allowedMethods());

    // By returning an object, you let NestJS handle the final response
    return {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: `Cannot ${req.method} ${req.path}`,
      error: 'Method Not Allowed',
    };
  }

  /**
   * Override this in subclasses if different controllers support
   * different HTTP methods.
   */
  protected allowedMethods(): string {
    return 'POST, GET, PATCH, DELETE';
  }
}

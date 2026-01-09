import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import DataObject from '../../model/data_object';
type HeaderValue = string | number | string[] | undefined;

@Injectable()
export class RayIdMiddleware implements NestMiddleware {
  findHeaderIgnoreCase = (
    headers: DataObject,
    keyToFind: string,
  ): HeaderValue | null => {
    // Find the key in the headers object, ignoring case
    const foundKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === keyToFind.toLowerCase(),
    );

    // If the key was found, return its value; otherwise, return null
    if (foundKey) {
      const value = headers[foundKey];
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        Array.isArray(value) ||
        typeof value === 'undefined'
      ) {
        return value;
      }
      return null;
    }
    return null;
  };

  use(req: Request, res: Response, next: NextFunction) {
    const rayId = this.findHeaderIgnoreCase(req.headers, 'x-ray-id');
    //X-FINGERPRINT
    const fingerprint = this.findHeaderIgnoreCase(req.headers, 'x-fingerprint');
    if (rayId && fingerprint) {
      // Set the same header on the response
      res.setHeader('x-ray-id', rayId);
      res.setHeader('x-fingerprint', fingerprint);
      res.setHeader('Referrer-Policy', 'no-referrer');
    }
    next();
  }
}

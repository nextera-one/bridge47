// src/common/pipes/sanitize.pipe.ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { sanitizeMessage } from '../../utils/sanitize-message';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: Record<string, unknown>, metadata: ArgumentMetadata) {
    console.log(metadata);
    if (typeof value === 'string') {
      return sanitizeMessage(value);
    }
    if (value && typeof value === 'object') {
      // sanitize all string props recursively
      for (const key of Object.keys(value)) {
        if (typeof value[key] === 'string') {
          value[key] = sanitizeMessage(value[key]);
        }
      }
    }
    return value;
  }
}

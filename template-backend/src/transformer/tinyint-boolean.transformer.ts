// src/common/transformers/tinyint-boolean.transformer.ts
import { ValueTransformer } from 'typeorm';

export class TinyIntBooleanTransformer implements ValueTransformer {
  /**
   * When writing to the database:
   *  – cast anything “truthy” to 1, else 0
   */
  to(value: boolean | string | number): number {
    // normalize string/number first
    if (typeof value === 'string') {
      value =
        value.trim().toLowerCase() === 'true' || value.trim() === '1' ? 1 : 0;
    }
    if (typeof value === 'number') {
      value = value === 1 ? 1 : 0;
    }
    return value ? 1 : 0;
  }

  /**
   * When reading from the database:
   *  – interpret 1 as true, everything else as false
   */
  from(value: number | string | boolean | null): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      // sometimes drivers return '0'/'1'
      return value.trim() === '1';
    }
    // number case
    return value === 1;
  }
}

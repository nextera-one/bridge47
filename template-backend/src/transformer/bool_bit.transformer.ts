import { ValueTransformer } from 'typeorm';

export class BoolBitTransformer implements ValueTransformer {
  // This method is used when data is read from the database.
  to(value: boolean | string | number): Buffer {
    //convert boolean to buffer
    if (typeof value === 'string') {
      value = value.trim().toLowerCase() === 'true';
    }
    if (typeof value === 'number') {
      value = value === 1;
    }
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(!!value ? 1 : 0, 0);
    return buffer;
  }

  // This method is used when data is written to the database.
  from(value: Buffer | string | number | boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.trim().toLowerCase() === '1';
    if (typeof value === 'number') return value === 1;
    return value && value.length > 0 && value[0] === 1;
  }
}

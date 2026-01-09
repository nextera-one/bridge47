// src/common/transformers/uuid-binary16.transformer.ts
import { Buffer } from 'buffer';
import { ValueTransformer } from 'typeorm';

import StringUtil from '../common/utils/string.util';

export class UUIDBinary16Transformer implements ValueTransformer {
  /**
   * @param optimized If true, uses MySQL’s UUID_TO_BIN(...,1) swap-flag ordering;
   *                  if false, stores the raw bytes in big-endian.
   */
  constructor(private readonly optimized = false) {}

  to(value: string | null | undefined): Buffer | null {
    if (!value) return null;
    if (!StringUtil.isValidUUID(value)) {
      throw new Error(`Invalid UUID string: ${value}`);
    }

    // remove dashes
    const hex = value.replace(/-/g, '');

    if (!this.optimized) {
      // straight big-endian
      return Buffer.from(hex, 'hex');
    }

    // optimized: reorder time_hi, time_mid, time_low first
    const p1 = hex.substring(0, 8); // time_low
    const p2 = hex.substring(8, 12); // time_mid
    const p3 = hex.substring(12, 16); // time_hi_and_version
    const p4 = hex.substring(16, 20); // clock_seq
    const p5 = hex.substring(20); // node
    const reordered = p3 + p2 + p1 + p4 + p5;
    return Buffer.from(reordered, 'hex');
  }

  from(value: Buffer | string | null): string | null {
    if (value == null) return null;

    let buf: Buffer;
    if (Buffer.isBuffer(value)) {
      buf = value;
    } else if (typeof value === 'string' && StringUtil.isValidUUID(value)) {
      return value.toLowerCase();
    } else {
      return null;
    }

    if (buf.length !== 16) {
      throw new Error(`Invalid UUID buffer length ${buf.length}`);
    }

    let hex: string;
    if (!this.optimized) {
      // straight big-endian read
      hex = buf.toString('hex');
    } else {
      // optimized: swap back
      const p3 = buf.subarray(0, 2).toString('hex');
      const p2 = buf.subarray(2, 4).toString('hex');
      const p1 = buf.subarray(4, 8).toString('hex');
      const p4 = buf.subarray(8, 10).toString('hex');
      const p5 = buf.subarray(10, 16).toString('hex');
      hex = p1 + p2 + p3 + p4 + p5;
    }

    // re-insert dashes
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20),
    ]
      .join('-')
      .toLowerCase();
  }
}

export const uuidValueTransformer = new UUIDBinary16Transformer();

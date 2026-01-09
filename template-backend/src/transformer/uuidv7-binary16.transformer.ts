import { ValueTransformer } from 'typeorm';
// src/common/transformers/uuidv7-binary16.transformer.ts
import { Buffer } from 'buffer';

import StringUtil from 'src/common/utils/string.util';

// You can reuse your existing StringUtil or use a library like 'uuid' for validation
const isValidUUID = (value: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export class UUIDv7Binary16Transformer implements ValueTransformer {
  /**
   * Converts a UUIDv7 string to a Buffer for BINARY(16) storage.
   * UUIDv7 is naturally time-sortable, so no byte-swapping is needed.
   */
  to(value: string | null | undefined): Buffer | null {
    if (!value) {
      return null;
    }
    if (!isValidUUID(value)) {
      throw new Error(`Invalid UUID string: ${value}`);
    }

    // Remove dashes and convert the hex string to a Buffer.
    // The big-endian representation is already sortable by time.
    const hex = value.replace(/-/g, '');
    return Buffer.from(hex, 'hex');
  }

  /**
   * Converts a BINARY(16) Buffer back to a UUIDv7 string.
   */
  from(value: Buffer | null | undefined): string | null {
    try {
      if (!value) {
        return null;
      }

      if (!Buffer.isBuffer(value) || value.length !== 16) {
        // You might want to handle cases where it's already a string,
        // but for a clean transformation, we expect a Buffer from the DB.
        if (StringUtil.isValidUUID(value.toString())) {
          return value.toString();
        }
        throw new Error(`Invalid UUID buffer received from database.`);
      }

      const hex = value.toString('hex');

      // Re-insert dashes to format as a standard UUID string.
      return [
        hex.substring(0, 8),
        hex.substring(8, 12),
        hex.substring(12, 16),
        hex.substring(16, 20),
        hex.substring(20),
      ]
        .join('-')
        .toLowerCase();
    } catch (error) {
      console.error('Error converting UUID buffer to string:', error);
      throw error;
    }
  }
}

/**
 * A singleton instance of the UUIDv7 transformer for use in entities.
 */
export const uuidV7ValueTransformer = new UUIDv7Binary16Transformer();

// filepath: /c:/Users/USER/Desktop/cloud-hosting-backend/src/encryption/encryption-transformer.ts
import * as crypto from 'crypto';
import { ValueTransformer } from 'typeorm';

import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

// Define output format types
export enum EncryptionOutputFormat {
  STRING = 'string',
  JSON = 'json',
}

export class EncryptionTransformer implements ValueTransformer {
  private static key: Buffer;
  private static iv: Buffer;
  private static initialized = false;
  private outputFormat: EncryptionOutputFormat;

  constructor(
    outputFormat: EncryptionOutputFormat = EncryptionOutputFormat.STRING,
  ) {
    this.outputFormat = outputFormat;
  }

  static initialize() {
    if (!EncryptionTransformer.initialized) {
      const encryptionKey = configService.get<string>('ENCRYPTION_KEY');
      const encryptionIv = configService.get<string>('ENCRYPTION_IV');
      if (!encryptionKey || !encryptionIv) {
        throw new Error('Encryption key or IV not set in environment');
      }
      EncryptionTransformer.key = Buffer.from(encryptionKey, 'hex');
      EncryptionTransformer.iv = Buffer.from(encryptionIv, 'hex');
      EncryptionTransformer.initialized = true;
    }
  }
  to(value: any): string | object {
    if (!EncryptionTransformer.initialized) {
      EncryptionTransformer.initialize();
    }
    if (!value) {
      return value;
    }

    // Convert value to string - if it's an object, stringify it
    let stringValue: string;
    if (typeof value === 'string') {
      stringValue = value;
    } else {
      stringValue = JSON.stringify(value);
    }

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      new Uint8Array(EncryptionTransformer.key),
      new Uint8Array(EncryptionTransformer.iv),
    );
    let encrypted = cipher.update(stringValue, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    if (this.outputFormat === EncryptionOutputFormat.JSON) {
      // Return as a JSON object with the "encrypted" key
      return { encrypted };
    } else {
      // Return as a plain string
      return encrypted;
    }
  }
  from(value: any): any {
    if (!EncryptionTransformer.initialized) {
      EncryptionTransformer.initialize();
    }
    if (!value) {
      return value;
    }

    try {
      // First, parse the value as JSON to extract the encrypted data
      let encryptedValue: string;

      if (typeof value !== 'string' && value.encrypted) {
        encryptedValue = value.encrypted;
      } else {
        encryptedValue = value;
      }

      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        new Uint8Array(EncryptionTransformer.key),
        new Uint8Array(EncryptionTransformer.iv),
      );
      let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      return value;
    }
  }
}

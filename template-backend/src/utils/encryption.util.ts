// encryption.util.ts
// ensure your .env is loaded if you run this standalone
import * as crypto from 'crypto';
import 'dotenv/config';

//
// Sanity-checks at startup
//
const encKeyEnv = process.env.ENCRYPTION_KEY_ENC;
if (!encKeyEnv) {
  throw new Error('❌ ENCRYPTION_KEY_ENC is not set – did you load your .env?');
}
console.log('⚙️  ENV_MASTER_KEY =', process.env.ENV_MASTER_KEY);
console.log('⚙️  ENCRYPTION_KEY_ENC =', encKeyEnv);

export function decryptEnvVar(val: string): string {
  if (!val.startsWith('ENC(') || !val.endsWith(')')) {
    return val; // not encrypted, return as-is
  }
  const ciphertextBase64 = val.slice(4, -1);
  const buff = Buffer.from(ciphertextBase64, 'base64');
  if (buff.length < 28) {
    throw new Error('Invalid encrypted value format: too short.');
  }

  const iv = buff.subarray(0, 12);
  const tag = buff.subarray(buff.length - 16);
  const ciphertext = buff.subarray(12, buff.length - 16);

  const masterHex = process.env.ENV_MASTER_KEY;
  if (!masterHex) {
    throw new Error('❌ ENV_MASTER_KEY not set. Cannot decrypt ENV vars.');
  }
  const masterKey = Buffer.from(masterHex, 'hex');
  if (masterKey.length !== 32) {
    throw new Error('ENV_MASTER_KEY must be 64 hex characters (32 bytes).');
  }

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (e) {
    console.error('Decryption failed for an ENV var:', (e as Error).message);
    throw new Error(
      'Failed to decrypt ENV var. Check ENV_MASTER_KEY and encrypted values.',
    );
  }
}

// ---- decrypt the field-encryption key from your ENV ----
let rawHexKey: string;
try {
  rawHexKey = decryptEnvVar(encKeyEnv);
} catch (e) {
  console.error(
    '❌ Failed to decrypt ENCRYPTION_KEY_ENC:',
    (e as Error).message,
  );
  throw new Error('Critical: cannot initialize field encryption key.');
}

export const ENCRYPTION_KEY = Buffer.from(rawHexKey, 'hex');
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte Buffer (64 hex chars).');
}

// ---- decrypt optional JSON config of which table fields to encrypt ----
const encFieldsEnv = process.env.ENCRYPTED_FIELDS_ENC;
let configRaw = '{}';
if (encFieldsEnv) {
  try {
    configRaw = decryptEnvVar(encFieldsEnv);
  } catch (e) {
    console.warn(
      '⚠️ ENCRYPTED_FIELDS_ENC invalid; defaulting to {}.',
      (e as Error).message,
    );
  }
} else {
  console.warn('⚠️ ENCRYPTED_FIELDS_ENC not set; defaulting to {}.');
}

export const ENCRYPTION_CONFIG: Record<string, string[]> =
  JSON.parse(configRaw);

/**
 * Encrypt a UTF-8 string using AES-256-GCM with a random 12-byte IV.
 * Returns base64( IV ‖ ciphertext ‖ authTag ).
 */
export function encryptText(plaintext: string): string {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error(
      'ENCRYPTION_KEY must be 32 bytes; ensure it’s set up correctly.',
    );
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]).toString('base64');
}

/**
 * Decrypt a base64-encoded AES-256-GCM blob (IV ‖ ciphertext ‖ authTag).
 * Returns the original UTF-8 string, or the input if decryption fails.
 */
export function decryptText(ciphertextBase64: string): string {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error(
      'ENCRYPTION_KEY must be 32 bytes; ensure it’s set up correctly.',
    );
  }
  const buff = Buffer.from(ciphertextBase64, 'base64');
  if (buff.length < 28) {
    throw new Error('Invalid ciphertext format: too short for AES-GCM.');
  }

  const iv = buff.subarray(0, 12);
  const tag = buff.subarray(buff.length - 16);
  const ciphertext = buff.subarray(12, buff.length - 16);

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return dec.toString('utf8');
  } catch (e) {
    console.warn(
      'Decryption failed, returning original cyphertext:',
      (e as Error).message,
    );
    return ciphertextBase64;
  }
}

// import { argv } from 'process';
// // helper.ts
// import { createCipheriv, randomBytes } from 'crypto';

// /**
//  * Generates a 32-byte (256-bit) encryption key as a 64-character hex string.
//  */
// export function generateEncryptionKey(): string {
//   return randomBytes(32).toString('hex');
// }

// /**
//  * Encrypts a UTF-8 string (hex or JSON or whatever) using AES-256-GCM.
//  * Returns a string of the form: ENC(base64(iv‖ciphertext‖authTag))
//  */
// export function encryptEnvVarString(
//   plaintext: string,
//   masterKeyHex: string,
// ): string {
//   const key = Buffer.from(masterKeyHex, 'hex');
//   if (key.length !== 32) {
//     throw new Error('masterKeyHex must be 64 hex characters (32 bytes).');
//   }

//   const iv = randomBytes(12);
//   const cipher = createCipheriv('aes-256-gcm', key, iv);
//   const encrypted = Buffer.concat([
//     cipher.update(Buffer.from(plaintext, 'utf8')),
//     cipher.final(),
//   ]);
//   const tag = cipher.getAuthTag();
//   const out = Buffer.concat([iv, encrypted, tag]).toString('base64');
//   return `ENC(${out})`;
// }

// // --- CLI support ---
// if (require.main === module) {
//   const masterKey = generateEncryptionKey();
//   const fieldKey = generateEncryptionKey();
//   console.log('► New ENV_MASTER_KEY:', masterKey);
//   console.log('► New ENCRYPTION_KEY (hex):', fieldKey);
//   console.log(
//     '► Matching ENCRYPTION_KEY_ENC:',
//     encryptEnvVarString(fieldKey, masterKey),
//   );

//   // If you run with `--json '{"foo":"bar"}'`, encrypt that JSON for ENCRYPTED_FIELDS_ENC
//   const jsonFlag = argv.find((a) => a.startsWith('--json='));
//   if (jsonFlag) {
//     const json = jsonFlag.replace(/^--json=/, '');
//     const encJson = encryptEnvVarString(json, masterKey);
//     console.log(`► ENCRYPTED_FIELDS_ENC for ${jsonFlag}:`, encJson);
//   }
// }

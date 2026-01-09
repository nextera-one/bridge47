/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js';

const secretKey = window.location.host;

export default class CryptoUtils {
  // Encrypt data
  public static encryptData(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
  }

  // Decrypt data
  public static decryptData(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}

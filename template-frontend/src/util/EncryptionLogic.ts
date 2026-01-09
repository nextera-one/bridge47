import * as CryptoJS from 'crypto-js';

export default class EncryptionLogic {
  public static encryptData(data: string, secretKey?: string): string {
    try {
      // if !secretKey get the domain as key
      if (!secretKey) {
        secretKey = window.location.hostname;
      }
      const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
      return encryptedData;
    } catch (error) {
      console.error(error);
      return data;
    }
  }

  public static decryptData(encryptedData: string, secretKey?: string): string {
    try {
      if (!secretKey) {
        secretKey = window.location.hostname;
      }
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
        CryptoJS.enc.Utf8,
      );
      return decryptedData;
    } catch (error) {
      console.error(error);
      return encryptedData;
    }
  }
}

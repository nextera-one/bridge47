import { toHijri } from 'hijri-converter';
import { Point } from 'geojson';
import { randomBytes } from 'crypto';

export default class StringUtil {
  // Check if the given argument is null or undefined.
  public static isNullOrUndefined(args: any): boolean {
    return args === null || args === undefined;
  }

  // Capitalize the first letter of a string.
  public static capitalizeFirstLetter(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Capitalize the first character and concatenate the rest of the string.
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Convert a camelCase string to snake_case.
  public static camelToSnake(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Replace uppercase letters with underscores followed by lowercase letters.
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  // Convert a snake_case string to camelCase.
  public static snakeToCamel(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Replace underscores followed by lowercase letters with uppercase letters.
    return str.replace(/(_\w)/g, (letter) => letter[1].toUpperCase());
  }

  // Convert a snake_case string to PascalCase.
  public static snakeToPascal(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Capitalize the first letter of the camelCase result.
    return StringUtil.capitalizeFirstLetter(StringUtil.snakeToCamel(str));
  }

  // Capitalize the first letter of a string.
  public static camelToPascal(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Capitalize the first letter.
    return StringUtil.capitalizeFirstLetter(str);
  }

  // Convert a PascalCase string to camelCase.
  public static pascalToCamel(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Lowercase the first letter.
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  // Convert a PascalCase string to snake_case.
  public static pascalToSnake(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Convert PascalCase to camelCase and then to snake_case.
    return StringUtil.camelToSnake(str);
  }

  // Convert a string to uppercase.
  public static capitalize(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Convert the string to uppercase.
    return str.toUpperCase();
  }

  // Convert a string to lowercase.
  public static decapitalize(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Convert the string to lowercase.
    return str.toLowerCase();
  }

  // Capitalize the first letter of each word in a string.
  public static capitalizeWords(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Split the string into words, capitalize each word, and join them.
    return str.replace(/\w\S*/g, (word) => StringUtil.capitalize(word));
  }

  // Decapitalize the first letter of each word in a string.
  public static decapitalizeWords(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Split the string into words, decapitalize each word, and join them.
    return str.replace(/\w\S*/g, (word) => StringUtil.decapitalize(word));
  }

  // Capitalize the first letter of each word in a string.
  public static capitalizeFirstLetterOfWords(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Split the string into words, capitalize the first letter of each word, and join them.
    return str.replace(/\w\S*/g, (word) =>
      StringUtil.capitalizeFirstLetter(word),
    );
  }

  // Decapitalize the first letter of a string.
  public static decapitalizeFirstLetter(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Lowercase the first letter and keep the rest of the string unchanged.
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  // Decapitalize the first letter of each word in a string.
  public static decapitalizeFirstLetterOfWords(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Split the string into words, decapitalize the first letter of each word, and join them.
    return str.replace(/\w\S*/g, (word) =>
      StringUtil.decapitalizeFirstLetter(word),
    );
  }

  // Capitalize the first letter and decapitalize the rest of a word.
  public static capitalizeFirstLetterAndDecapitalizeOthers(
    str: string,
  ): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Capitalize the first letter and convert the rest to lowercase.
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Encode a string to base64.
  public static base64Encode(str: string): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Encode the string to base64.
    return Buffer.from(str).toString('base64');
  }

  // Decode a base64 string to UTF-8.
  public static base64Decode(str: string): string {
    if (StringUtil.isNullOrUndefined(str) || !StringUtil.isBase64(str)) {
      return null;
    }
    // Decode the base64 string to UTF-8.
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  //check if str isBase64 using regex
  public static isBase64(str: string): boolean {
    if (StringUtil.isNullOrUndefined(str)) {
      return false;
    }
    const base64Regex = /^[a-zA-Z0-9+/]*={0,2}$/;
    // Check if the string has a valid length and characters
    if (str.length % 4 !== 0 || !base64Regex.test(str)) {
      return false;
    }
    return true;
  }

  // Check if a string is empty or contains only whitespace.
  public static isEmpty(str: string): boolean {
    if (StringUtil.isNullOrUndefined(str)) {
      return true;
    }
    // Trim the string and check if it has a length of 0.
    return str.trim().length === 0;
  }

  // Convert a base64-encoded string to an object.
  public static base64ToObj(base64String: string): any {
    if (
      StringUtil.isNullOrUndefined(base64String) ||
      StringUtil.isEmpty(base64String)
    ) {
      return null;
    }
    // Decode the base64 string to JSON and parse it into an object.
    const decodedBase64 = StringUtil.base64Decode(base64String.toString());
    if (StringUtil.isNullOrUndefined(decodedBase64)) {
      return null;
    }
    const obj = JSON.parse(decodedBase64);
    return obj;
  }

  // Convert an object to a base64-encoded string.
  public static objToBase64(obj: any): string {
    if (StringUtil.isNullOrUndefined(obj)) {
      return '';
    }
    // Encode the object as JSON and then to base64.
    const base64String = StringUtil.base64Encode(JSON.stringify(obj));
    return base64String;
  }

  // Convert a base64-encoded string to an array.
  public static base64ToArray(base64String: string): any {
    if (StringUtil.isNullOrUndefined(base64String)) {
      return null;
    }
    // Decode the base64 string to UTF-8, parse it into an array.
    const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
    const decodedArray = JSON.parse(decodedString);
    return decodedArray;
  }

  // Convert an array to a base64-encoded string.
  public static arrayToBase64(array: any[]): string {
    if (StringUtil.isNullOrUndefined(array)) {
      return '';
    }
    // Convert the array to a buffer and then to base64.
    const buffer = Buffer.from(array);
    const base64String = buffer.toString('base64');
    return base64String;
  }

  // Capitalize the first letter and decapitalize the rest of each word in a string.
  public static capitalizeFirstLetterAndDecapitalizeOthersWords(
    str: string,
  ): string {
    if (StringUtil.isNullOrUndefined(str)) {
      return '';
    }

    // Capitalize the first letter and convert the rest to lowercase for each word.
    return str.replace(/\w\S*/g, (word) =>
      StringUtil.capitalizeFirstLetterAndDecapitalizeOthers(word),
    );
  }

  // Generate a random string of the given length.
  public static randomString(length: number): string {
    if (StringUtil.isNullOrUndefined(length)) {
      return '';
    }
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  // Generate a random hexadecimal string of the given length.
  public static generateRandomHexString(length = 21) {
    const characters = '0123456789abcdef';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  // Generate a random number of the given length.
  public static generateRandomNumber(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits.charAt(randomIndex);
    }
    return otp;
  }

  // Generate a reference number based on the current date and time, with a random part.
  public static generateReferenceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliSeconds = date.getMilliseconds();
    const random = StringUtil.generateRandomHexString(6);
    // Create a reference number using date and time components along with a random part.
    const referenceNumber = `E-${year}${month}${day}${hour}${minutes}${seconds}${milliSeconds}${random}`;
    return referenceNumber;
  }
  public static toHijriDateConverter = (date) => {
    const dateItem = new Date(date);
    const year = dateItem.getFullYear();
    const month = dateItem.getMonth() + 1;
    const day = dateItem.getDate();
    return toHijri(year, month, day);
  };

  public static getNumberOfDays(startDate: Date, endDate: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(
      differenceInMilliseconds / millisecondsPerDay,
    );

    return numberOfDays;
  }

  public static calculateDateDiff(
    startDate: Date,
    endDate: Date,
    reservationType: string,
  ): any {
    const startedAt = startDate.getTime();
    const endedAt = endDate.getTime();

    // Calculate the time difference in milliseconds
    const timeDifference = endedAt - startedAt;

    const millisecondsInSecond = 1000;
    const millisecondsInMinute = 60 * millisecondsInSecond;
    const millisecondsInHour = 60 * millisecondsInMinute;
    const millisecondsInDay = 24 * millisecondsInHour;
    const millisecondsInMonth = 30 * millisecondsInDay; // Assuming 30 days per month for simplicity

    let months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0;

    // Calculate total time units
    if (timeDifference > 0) {
      // Increment the respective unit based on the reservation type
      switch (reservationType.toLowerCase()) {
        case 'monthly':
          months = Math.ceil(timeDifference / millisecondsInMonth);
          break;
        case 'weekly':
          weeks = Math.ceil(timeDifference / (7 * millisecondsInDay));
          break;
        case 'daily':
          days = Math.ceil(timeDifference / millisecondsInDay);
          break;
        case 'hourly':
          hours = Math.ceil(timeDifference / millisecondsInHour);
          break;
        case 'minutely':
          minutes = Math.ceil(timeDifference / millisecondsInMinute);
          break;
      }
    }

    // Construct and return the duration object
    const durationObject = {
      monthly: months,
      weekly: weeks,
      daily: days,
      hourly: hours,
      minutely: minutes,
    };

    return durationObject;
  }

  public static isValidUUID(uuid: string): boolean {
    return StringUtil.isValidUUIDv4(uuid) || StringUtil.isValidUUIDv7(uuid);
  }

  public static isValidUUIDv4(uuid: string): boolean {
    const regex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }

  public static isValidUUIDv7(uuid: string): boolean {
    const regex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }

  public static isValidPassword(password: string): boolean {
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const numberRegex = /[0-9]/;
    const capitalRegex = /[A-Z]/;
    const smallRegex = /[a-z]/;

    // Check if the password contains at least one symbol, one number, one capital letter, and is at least 8 characters long
    const hasSymbol = symbolRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasCapital = capitalRegex.test(password);
    const hasSmall = smallRegex.test(password);
    const isLengthValid = password.length >= 8;

    return hasSymbol && hasNumber && hasCapital && hasSmall && isLengthValid;
  }
  public static generateRandomPassword(length: number): string {
    // Define character sets
    const numbers = '0123456789';
    const lettersLower = 'abcdefghijklmnopqrstuvwxyz';
    const lettersUpper = lettersLower.toUpperCase();
    const symbols = '@#$%=|';

    // Ensure password includes at least one of each type
    const passwordParts = [
      StringUtil.randomChar(numbers),
      StringUtil.randomChar(lettersLower),
      StringUtil.randomChar(lettersUpper),
      StringUtil.randomChar(symbols),
    ];

    // Fill the rest of the password length with random characters from all sets
    const allChars = numbers + lettersLower + lettersUpper + symbols;
    for (let i = passwordParts.length; i < length; i++) {
      passwordParts.push(StringUtil.randomChar(allChars));
    }

    // Shuffle the password parts array to randomize the order
    const shuffledPassword = StringUtil.shuffleArray(passwordParts).join('');

    return shuffledPassword;
  }

  // Function to pick a random character from a given set
  public static randomChar(characters: string): string {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Function to shuffle an array
  public static shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  public static isBcryptHash(password: string): boolean {
    const bcryptRegex = /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(password);
  }
  public static translatePlateNumber(plateNumber: string): string {
    const mapping: { [key: string]: string } = {
      A: 'أ',
      B: 'ب',
      C: '',
      D: 'د',
      E: 'ع',
      F: '',
      G: 'ق',
      H: 'هـ',
      I: '',
      J: 'ح',
      K: 'ك',
      L: 'ل',
      M: '',
      N: 'ن',
      O: '',
      P: '',
      Q: '',
      R: 'ر',
      S: 'س',
      T: 'ط',
      U: 'و',
      V: 'ى',
      W: '',
      X: 'ص',
      Y: '',
      Z: 'م',
    };
    const reversedInput = plateNumber.toUpperCase().split('').reverse();
    const translatedReversedInput = reversedInput.map((letter) => {
      return mapping[letter] || letter;
    });
    return translatedReversedInput.join(' ');
  }

  public static prepareLocation(
    latitude: string,
    longitude: string,
  ): Point | null {
    if (!latitude || !longitude) return null;
    return {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)], // [lng, lat]
    };
  }
  public static checkBoolean(
    value: boolean | number | string | null | undefined,
  ): boolean {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      value.toString().trim() === ''
    ) {
      return false;
    }
    if (typeof value === 'string') {
      if (value === '1' || value.toLowerCase() === 'true') {
        return true;
      } else if (value === '0' || value.toLowerCase() === 'false') {
        return false;
      }
      throw new Error(`Invalid : ${value}`);
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return value;
  }
  public static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static checkIPVersion(ip: string): 'IPv4' | 'IPv6' | 'Invalid' {
    const ipv4Pattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;

    if (ipv4Pattern.test(ip)) {
      return 'IPv4';
    } else if (ipv6Pattern.test(ip)) {
      return 'IPv6';
    } else {
      return 'Invalid';
    }
  }

  public static generateTicketId(): string {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:TZ.]/g, '') // 20250912164530
      .slice(0, 14);
    const random = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    return `TICKET-${timestamp}-${random}`;
  }

  public static createOrderRef(prefix = 'ORD'): string {
    const now = new Date(); // UTC to avoid TZ issues
    const Y = now.getUTCFullYear();
    const M = String(now.getUTCMonth() + 1).padStart(2, '0');
    const D = String(now.getUTCDate()).padStart(2, '0');
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
    const rand = randomBytes(3).toString('base64url').toUpperCase(); // ~4-5 chars

    // Example: ORD-20250914-153012123-9Z4H
    return `${prefix}-${Y}${M}${D}-${h}${m}${s}${ms}-${rand}`;
  }
}

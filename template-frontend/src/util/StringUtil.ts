import type DataObject from 'src/models/DataObject';
import LanguageUtil from './LanguageUtil';
import { i18n } from 'src/boot/i18n';

export default class StringUtil {
  public static isArabicString(str: string) {
    if (!str || str.trim().length === 0) return false;
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(str);
  }

  public static translate(str: string): string {
    try {
      // console.log(`${str}: '${str}',`);
      const translated = i18n?.global?.t(str);
      if (StringUtil.isArabicString(translated)) {
        return translated;
      }
      if (translated === str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
          return str.toUpperCase();
        });
      } else return translated;
    } catch (error) {
      console.error(`${str}: '${str}',`, error);
      return str;
    }
  }

  public static snakeToCamelCase(snakeStr: string): string {
    console.log(snakeStr);

    if (!snakeStr) return snakeStr;
    if (typeof snakeStr !== 'string') return snakeStr;
    return snakeStr
      .toLowerCase()
      .split('_')
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('');
  }

  public static snakeToTitleCase(snakeStr: string): string {
    return snakeStr
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  //generate uuid
  public static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // eslint-disable-next-line
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    });
  }

  public static getInitials(text: string) {
    const names = text.split(' ');
    if (!names) return '';
    let initials = names[0]?.substring(0, 1).toUpperCase();

    if (names && names.length > 1) {
      const s = names[names.length - 1] as string;
      initials += s.substring(0, 1).toUpperCase();
    }
    return initials;
  }
  //generate short unique id start with  3 charachters then 3 digits
  public static shortId(length: number): string {
    return (
      StringUtil.randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') +
      StringUtil.randomString(length, '0123456789')
    );
  }

  //generate random string
  public static randomString(length: number, chars: string) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  //convert camel case to title case
  public static camelCaseToTitleCase(str: string) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }
  public static toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, '_');
  }

  //decodeBase64
  public static decodeBase64(str: string) {
    return atob(str);
  }

  //encodeBase64
  public static encodeBase64(str: string) {
    if (!str || str.trim().length === 0) return '';
    return btoa(str);
  }

  //format number currency local with currency code

  public static formatNumberCurrencyLocal(value: number, currencyCode?: string): string {
    if (!currencyCode) {
      currencyCode = 'SAR';
    }
    return new Intl.NumberFormat(LanguageUtil.isArabic() ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }
  //generate password
  public static generatePassword() {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialCharacters = '!@#$%^&*()_+{}:;,.?~`-';
    const allCharacters = lowerCaseLetters + upperCaseLetters + digits + specialCharacters;
    const minLength = 8;
    const maxLength = 20;

    const getRandomCharacter = (characters: string) => {
      return characters[Math.floor(Math.random() * characters.length)];
    };

    let password = '';

    // Ensure at least one character from each required set is included
    password += getRandomCharacter(lowerCaseLetters);
    password += getRandomCharacter(upperCaseLetters);
    password += getRandomCharacter(digits);
    password += getRandomCharacter(specialCharacters);

    // Fill the rest of the password length with random characters
    const remainingLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength - 4;
    for (let i = 0; i < remainingLength; i++) {
      password += getRandomCharacter(allCharacters);
    }

    // Shuffle the characters to avoid predictable patterns
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }
  //generate Api Key
  public static generateApiKey() {
    const apiKey = crypto.randomUUID();
    return apiKey;
  }

  public static generateApiKey256(length = 256): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = 'a';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      apiKey += charset[randomIndex];
    }

    return apiKey;
  }

  public static isDateOrIsoString(value: string | Date): boolean {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    // Check if the value is a Date object and is valid
    if (value instanceof Date && !isNaN(value.getTime())) {
      return true;
    }

    // Check if the value is a string matching the ISO 8601 format
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      return true;
    }

    return false;
  }

  public static sortByLanguage(a: DataObject, b: DataObject) {
    return LanguageUtil.isArabic()
      ? ((a.name as DataObject)?.ar as string).localeCompare((b.name as DataObject)?.ar as string)
      : ((a.name as DataObject)?.en as string).localeCompare((b.name as DataObject)?.en as string);
  }

  public static looksLikeHTML(str: string): boolean {
    // matches any "<...>" where inside could be attributes or quoted strings
    const htmlTagRE = /<("[^"]*"|'[^']*'|[^'">])*>/;
    return htmlTagRE.test(str);
  }
}

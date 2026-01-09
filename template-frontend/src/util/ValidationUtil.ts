import StringUtil from './StringUtil'

export default class ValidationUtil {
  public static readonly NUMBER_REGEX = /^\d+$/
  public static readonly EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.){3}[0-9]{1,3}|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  public static readonly MOBILE_REGEX = /^(\+|00)\d{10,15}$/
  public static readonly URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  public static readonly BASE64_REGEX = /^data:image\/(png|jpeg|gif);base64,/
  public static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  public static readonly MAX_LENGTH_10_REGEX = /^.{0,10}$/
  public static readonly MAX_LENGTH_50_REGEX = /^.{0,50}$/

  public static readonly CRON_EXPRESSION =
    /^(\*|([0-5]?\d))\s+(\*|([01]?\d|2[0-3]))\s+(\*|([01]?\d|2[0-9]|3[01]))\s+(\*|(1[0-2]|0?\d))\s+(\*|([0-6]))$/

  //uuid
  public static readonly UUID_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

  public static readonly isUUID = (uuid: string) => {
    return ValidationUtil.UUID_REGEX.test(uuid)
  }

  public static isValidEmail(email: string): boolean {
    if (!email) return false
    return ValidationUtil.EMAIL_REGEX.test(email)
  }

  public static isPasswordComplexEnough(password: string): boolean {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasCode = /[!@#$%^&()_+={};':",.<>?/\\[\]\\-]/.test(password)
    const hasDigit = /\d/.test(password)
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasCode && hasDigit
  }

  public static isValidPassword(pass: string): string | boolean {
    if (pass.length < 8) {
      return StringUtil.translate('passwordMustBeAtLeast8CharactersLong')
    }
    if (!/[A-Z]/.test(pass)) {
      return StringUtil.translate('passwordMustContainAtLeastOneUppercaseLetter')
    }
    if (!/\d/.test(pass)) {
      return StringUtil.translate('passwordMustContainAtLeastOneNumber')
    }
    if (!/[!@#$%^&*()_+{}:;,.?~`-]/.test(pass)) {
      return StringUtil.translate('passwordMustContainAtLeastOneSpecialCharacter')
    }
    return true
  }

  public static isValidMobile(mobile: string): boolean {
    if (!mobile) return false
    return ValidationUtil.MOBILE_REGEX.test(mobile)
  }
  public static isValidUrl(url: string): boolean {
    if (!url) return false
    return ValidationUtil.URL_REGEX.test(url)
  }
  public static isValidBase64(base64: string): boolean {
    if (!base64) return false
    return ValidationUtil.URL_REGEX.test(base64)
  }

  //validate length beased on min and max
  public static isValidLength(value: string, min: number, max: number): boolean {
    if (!value) return false
    return value.length >= min && value.length <= max
  }

  //validate by giving REGEX
  public static isValidRegex(value: string, regex: RegExp): boolean {
    if (!value) return false
    return regex.test(value)
  }

  public static isArabicString(str: string) {
    if (!str || str.trim().length === 0) return false
    const arabicRegex = /[\u0600-\u06FF]/
    return arabicRegex.test(str)
  }

  public static isEnglishString(str: string) {
    if (!str || str.trim().length === 0) return false
    const englishRegex = /^[A-Za-z0-9]*$/
    return englishRegex.test(str)
  }

  public static isNumber(value: string) {
    if (!value) return false
    return ValidationUtil.NUMBER_REGEX.test(value)
  }

  public static isLocation(value: string) {
    const latLngRegex =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
    return latLngRegex.test(value)
  }
  public static isValidIPAddress(value: string): boolean {
    const ipv4Pattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Pattern = /([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)/

    return ipv4Pattern.test(value) || ipv6Pattern.test(value)
  }
}

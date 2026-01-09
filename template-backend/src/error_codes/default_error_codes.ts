import { HttpStatus } from '@nestjs/common';

import { ReadErrorCodesDto } from './dto/read-error_codes.dto';

export class DefaultErrorCodes {
  // Public static fields for easy access to error code strings
  public static readonly NOT_FOUND = 'NOT_FOUND';
  public static readonly INVALID_INPUT = 'INVALID_INPUT';
  public static readonly INVALID_AUTH = 'INVALID_AUTH';
  public static readonly INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
  public static readonly ACCESS_DENIED = 'ACCESS_DENIED';
  public static readonly INTERNAL_ERROR = 'INTERNAL_ERROR';
  public static readonly CONFLICT = 'CONFLICT';
  public static readonly TOKEN_EXPIRED = 'TOKEN_EXPIRED';
  public static readonly TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';
  public static readonly SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';
  public static readonly PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE';
  public static readonly INVALID_OTP = 'INVALID_OTP';
  public static readonly INVALID_OTP_VERIFICATION = 'INVALID_OTP_VERIFICATION';
  public static readonly UPLOAD_FAILED = 'UPLOAD_FAILED';
  public static readonly NO_ROLES_FOUND_FOR_USER = 'NO_ROLES_FOUND_FOR_USER';
  public static readonly INSUFFICIENT_ROLE = 'INSUFFICIENT_ROLE';
  public static readonly NOT_AUTHORIZED_FOR_ENDPOINT =
    'NOT_AUTHORIZED_FOR_ENDPOINT';
  public static readonly DEVICE_ID_IS_MISSING = 'DEVICE_ID_IS_MISSING';
  public static readonly FILE_BUFFER_MISSING = 'FILE_BUFFER_MISSING';
  public static readonly INVALID_TOKEN = 'INVALID_TOKEN';
  public static readonly DUPLICATE_ENTRY = 'DUPLICATE_ENTRY';
  public static readonly FOREIGN_KEY_CONSTRAINT_VIOLATION =
    'FOREIGN_KEY_CONSTRAINT_VIOLATION';
  public static readonly DATABASE_ERROR = 'DATABASE_ERROR';
  public static readonly DATA_TOO_LONG = 'DATA_TOO_LONG';
  public static readonly MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD';
  public static readonly FILE_NOT_FOUND = 'FILE_NOT_FOUND';
  public static readonly EMAIL_SENDING_FAILED = 'EMAIL_SENDING_FAILED';
  public static readonly IMAGE_PROCESSING_FAILED = 'IMAGE_PROCESSING_FAILED';
  public static readonly USER_INACTIVE = 'USER_INACTIVE';
  public static readonly USER_BLOCKED = 'USER_BLOCKED';
  public static readonly MOBILE_NUMBER_ALREADY_EXISTS =
    'MOBILE_NUMBER_ALREADY_EXISTS';
  public static readonly EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';
  //INTERNAL_SERVER_ERROR
  public static readonly INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

  // src/shared/filters/all-exceptions.filter.ts

  // --- NEW: Centralized mapping object ---
  public static readonly DB_ERROR_MAP: { [key: string]: string } = {
    // MySQL/MariaDB Codes
    ER_DUP_ENTRY: DefaultErrorCodes.DUPLICATE_ENTRY,
    ER_NO_REFERENCED_ROW_2: DefaultErrorCodes.FOREIGN_KEY_CONSTRAINT_VIOLATION,
    ER_ROW_IS_REFERENCED_2: DefaultErrorCodes.FOREIGN_KEY_CONSTRAINT_VIOLATION,
    ER_DATA_TOO_LONG: DefaultErrorCodes.DATA_TOO_LONG,
    ER_NO_DEFAULT_FOR_FIELD: DefaultErrorCodes.MISSING_REQUIRED_FIELD,

    // PostgreSQL Codes
    '23505': DefaultErrorCodes.DUPLICATE_ENTRY, // unique_violation
    '23503': DefaultErrorCodes.FOREIGN_KEY_CONSTRAINT_VIOLATION, // foreign_key_violation
    '22001': DefaultErrorCodes.DATA_TOO_LONG, // string_data_right_truncation
    '23502': DefaultErrorCodes.MISSING_REQUIRED_FIELD, // not_null_violation
  };

  private static readonly arr: Partial<ReadErrorCodesDto>[] = [
    {
      code: DefaultErrorCodes.NOT_FOUND,
      http_status_code: 404,
      default_message: 'Resource not found.',
      default_description:
        'The requested resource or a related entity could not be found.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_INPUT,
      http_status_code: 400,
      default_message: 'Invalid input provided.',
      default_description:
        'One or more fields in the request failed validation checks.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_AUTH,
      http_status_code: 401,
      default_message: 'Invalid authentication.',
      default_description:
        'A valid authentication token is required or the provided token is invalid.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_CREDENTIALS,
      http_status_code: 401,
      default_message: 'Invalid credentials.',
      default_description: 'The provided email or password is incorrect.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.ACCESS_DENIED,
      http_status_code: 403,
      default_message: 'Permission denied.',
      default_description:
        'You do not have the necessary permissions to perform this action.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INTERNAL_ERROR,
      http_status_code: 500,
      default_message: 'An unexpected error occurred.',
      default_description:
        'An internal server error has occurred. This has been logged and our team will investigate.',
      is_reportable: true,
    },
    {
      code: DefaultErrorCodes.CONFLICT,
      http_status_code: 409,
      default_message: 'A conflict occurred with an existing resource.',
      default_description:
        'The request could not be completed due to a conflict with the current state of the target resource (e.g., duplicate email).',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.TOKEN_EXPIRED,
      http_status_code: 401,
      default_message: 'Your session has expired.',
      default_description:
        'The provided authentication token has expired. Please log in again to obtain a new one.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.TOO_MANY_REQUESTS,
      http_status_code: 429,
      default_message: 'Too many requests.',
      default_description:
        'You have sent too many requests in a given amount of time. Please wait before trying again.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.SERVICE_UNAVAILABLE,
      http_status_code: 503,
      default_message: 'Service is temporarily unavailable.',
      default_description:
        'The server is currently undergoing maintenance or is overloaded. Please try again in a few moments.',
      is_reportable: true,
    },
    {
      code: DefaultErrorCodes.PAYLOAD_TOO_LARGE,
      http_status_code: 413,
      default_message: 'The provided file or data is too large.',
      default_description:
        'The request entity is larger than the limits defined by the server.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_OTP,
      http_status_code: 400,
      default_message: 'Invalid OTP.',
      default_description:
        'The provided One-Time Password is not valid or has expired.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_OTP_VERIFICATION,
      http_status_code: 400,
      default_message: 'Invalid OTP verification attempt.',
      default_description:
        'The OTP verification session is invalid or has expired. Please request a new OTP.',
      is_reportable: false,
    },
    //'Unable to connect to the database with provided credentials.'
    {
      code: DefaultErrorCodes.INVALID_CREDENTIALS,
      http_status_code: 400,
      default_message: 'Invalid credentials.',
      default_description:
        'Unable to connect to the database with provided credentials.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.UPLOAD_FAILED,
      http_status_code: 500,
      default_message: 'Upload Failed',
      default_description: 'Upload Failed',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.NO_ROLES_FOUND_FOR_USER,
      http_status_code: 403,
      default_message: 'No roles found for the user.',
      default_description: 'No roles found for the user.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INSUFFICIENT_ROLE,
      http_status_code: 403,
      default_message: 'Insufficient role for the action.',
      default_description:
        'The user does not have a sufficient role to perform this action.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.NOT_AUTHORIZED_FOR_ENDPOINT,
      http_status_code: 403,
      default_message: 'Not authorized for this endpoint.',
      default_description:
        'The user is not authorized to access this endpoint.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.DEVICE_ID_IS_MISSING,
      http_status_code: 400,
      default_message: 'Device ID is missing.',
      default_description:
        'The request requires a device ID, but none was provided.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.FILE_BUFFER_MISSING,
      http_status_code: 400,
      default_message: 'File buffer is missing.',
      default_description:
        'The request requires a file buffer, but none was provided.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INVALID_TOKEN,
      http_status_code: 401,
      default_message: 'Invalid token.',
      default_description: 'The provided authentication token is invalid.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.DUPLICATE_ENTRY,
      http_status_code: HttpStatus.CONFLICT, // 409
      default_message: 'A record with this information already exists.',
      default_description:
        'The request could not be completed because it would create a duplicate entry in the database.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.FOREIGN_KEY_CONSTRAINT_VIOLATION,
      http_status_code: HttpStatus.BAD_REQUEST, // 400
      default_message: 'Relationship constraint violation.',
      default_description:
        'The operation failed because a related entity required for this action does not exist.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.DATABASE_ERROR,
      http_status_code: HttpStatus.INTERNAL_SERVER_ERROR, // 500
      default_message: 'A database error occurred.',
      default_description:
        'An unexpected database error occurred. This has been logged for investigation.',
      is_reportable: true,
    },
    {
      code: DefaultErrorCodes.FILE_NOT_FOUND,
      http_status_code: HttpStatus.NOT_FOUND, // 404
      default_message: 'File not found.',
      default_description:
        'The requested file could not be found on the server.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.EMAIL_SENDING_FAILED,
      http_status_code: HttpStatus.INTERNAL_SERVER_ERROR, // 500
      default_message: 'Email sending failed.',
      default_description:
        'An error occurred while attempting to send the email. This has been logged for investigation.',
      is_reportable: true,
    },
    {
      code: DefaultErrorCodes.IMAGE_PROCESSING_FAILED,
      http_status_code: HttpStatus.INTERNAL_SERVER_ERROR, // 500
      default_message: 'Image processing failed.',
      default_description:
        'An error occurred while processing the image. This has been logged for investigation.',
      is_reportable: true,
    },
    {
      code: DefaultErrorCodes.USER_INACTIVE,
      http_status_code: HttpStatus.FORBIDDEN, // 403
      default_message: 'User account is inactive.',
      default_description:
        'The user account is inactive. Please contact support for assistance.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.USER_BLOCKED,
      http_status_code: HttpStatus.FORBIDDEN, // 403
      default_message: 'User account is blocked.',
      default_description:
        'The user account is blocked. Please contact support for assistance.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.MOBILE_NUMBER_ALREADY_EXISTS,
      http_status_code: HttpStatus.CONFLICT, // 409
      default_message: 'A record with this mobile number already exists.',
      default_description:
        'The request could not be completed because it would create a duplicate mobile number entry in the database.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.EMAIL_ALREADY_EXISTS,
      http_status_code: HttpStatus.CONFLICT, // 409
      default_message: 'A record with this email already exists.',
      default_description:
        'The request could not be completed because it would create a duplicate email entry in the database.',
      is_reportable: false,
    },
    {
      code: DefaultErrorCodes.INTERNAL_SERVER_ERROR,
      http_status_code: HttpStatus.INTERNAL_SERVER_ERROR, // 500
      default_message: 'An internal server error occurred.',
      default_description:
        'An unexpected internal server error has occurred. This has been logged and our team will investigate.',
      is_reportable: true,
    },
  ];

  /**
   * Retrieves a full error code object from the list based on its code.
   * @param code The string code of the error (e.g., DefaultErrorCodes.NOT_FOUND)
   * @returns The complete error object or undefined if not found.
   */
  public static get(code: string): Partial<ReadErrorCodesDto> | undefined {
    if (Object.keys(DefaultErrorCodes.DB_ERROR_MAP).includes(code)) {
      code = DefaultErrorCodes.DB_ERROR_MAP[code];
    }
    return this.arr.find((error) => error.code === code);
  }
}

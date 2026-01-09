export interface IMasterError {
  code: string; // your internal error code, e.g. 'AUTH_INVALID_TOKEN'
  http_status_code: number; // e.g. 400, 401, 500...
  is_reportable: boolean; // should be sent to error reporter (Sentry, etc.)
  default_message: string; // fallback message if no translation
  default_description?: string; // optional longer description
  meta?: Record<string, unknown>; // optional extra details
}

export interface ITranslation {
  message: string;
}

export interface IErrorDetails<TError extends IMasterError = IMasterError> {
  message: string;
  statusCode: number;
  is_reportable: boolean;
  success: false;
  data: null;
  error: TError;
  timestamp: number; // Date.now()
}

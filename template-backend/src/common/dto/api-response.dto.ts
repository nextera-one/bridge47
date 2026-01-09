export class ApiResponseDto<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error?: Record<string, any>;
  timestamp: number;
  is_reportable?: boolean;

  constructor(params: {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    error?: Record<string, any>;
    is_reportable?: boolean;
    timestamp?: number;
  }) {
    this.success = params.success;
    this.statusCode = params.statusCode;
    this.message = params.message;
    this.data = params.data;
    this.timestamp = params.timestamp ?? Date.now();
    if (params.error) {
      this.error = params.error;
    }
    if (typeof params.is_reportable === 'boolean') {
      this.is_reportable = params.is_reportable;
    }
  }
}

export interface ApiError {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: unknown;
}

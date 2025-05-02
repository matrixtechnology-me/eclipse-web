import { HttpError } from './http.error';

export class CustomError extends HttpError {
  constructor(
    message: string,
    statusCode: number,
    metadata?: Record<string, unknown>
  ) {
    super(statusCode, message, metadata);
  }
}

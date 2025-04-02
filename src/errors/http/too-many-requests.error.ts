import { HttpError } from '../http.error';

export class TooManyRequestsError extends HttpError {
  constructor(
    message = 'Too Many Requests',
    metadata?: Record<string, unknown>
  ) {
    super(429, message, metadata);
  }
}

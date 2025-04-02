import { HttpError } from '../http.error';

export class TokenExpiredError extends HttpError {
  constructor(message = 'Token expired', metadata?: Record<string, unknown>) {
    super(401, message, metadata);
  }
}

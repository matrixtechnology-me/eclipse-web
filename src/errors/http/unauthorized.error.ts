import { HttpError } from '../http.error';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', metadata?: Record<string, unknown>) {
    super(401, message, metadata);
  }
}

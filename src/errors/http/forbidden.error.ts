import { HttpError } from '../http.error';

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', metadata?: Record<string, unknown>) {
    super(403, message, metadata);
  }
}

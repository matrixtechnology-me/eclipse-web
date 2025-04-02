import { HttpError } from '../http.error';

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', metadata?: Record<string, unknown>) {
    super(404, message, metadata);
  }
}

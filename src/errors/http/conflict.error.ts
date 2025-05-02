import { HttpError } from '../http.error';

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', metadata?: Record<string, unknown>) {
    super(409, message, metadata);
  }
}

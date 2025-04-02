import { HttpError } from '../http.error';

export class AccountLockedError extends HttpError {
  constructor(message = 'Account locked', metadata?: Record<string, unknown>) {
    super(403, message, metadata);
  }
}

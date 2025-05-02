import { HttpError } from '../http.error';

export class InvalidCredentialsError extends HttpError {
  constructor(
    message = 'Invalid credentials',
    metadata?: Record<string, unknown>
  ) {
    super(401, message, metadata);
  }
}

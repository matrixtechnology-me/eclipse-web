import { HttpError } from '../http.error';

export class UnprocessableEntityError extends HttpError {
  constructor(
    message = 'UnprocessableEntity',
    metadata?: Record<string, unknown>
  ) {
    super(422, message, metadata);
  }
}

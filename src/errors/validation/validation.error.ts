import { HttpError } from '../http.error';

export class ValidationError extends HttpError {
  constructor(
    public errors: Record<string, string[]>,
    message = 'Validation failed',
    metadata?: Record<string, unknown>
  ) {
    super(400, message, metadata);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

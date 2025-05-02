import { HttpError } from '../http.error';

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', metadata?: Record<string, unknown>) {
    super(400, message, metadata);
  }
}

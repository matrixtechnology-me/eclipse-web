export class InternalServerError extends Error {
  statusCode: number;

  constructor(
    message: string = 'An unexpected error occurred. Please try again later'
  ) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

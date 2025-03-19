export class TokenExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please log in again');
    this.name = 'TokenExpiredError';
  }
}

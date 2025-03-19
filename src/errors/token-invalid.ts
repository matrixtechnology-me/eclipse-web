export class TokenInvalidError extends Error {
  constructor() {
    super('Invalid token. Please log in again');
    this.name = 'TokenInvalidError';
  }
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.metadata && { metadata: this.metadata }),
    };
  }
}

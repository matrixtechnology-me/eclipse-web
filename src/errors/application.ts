export abstract class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly title: string;
  public readonly details?: unknown;
  public readonly timestamp: Date;

  constructor(
    message: string,
    options: {
      title?: string;
      statusCode?: number;
      details?: unknown;
    } = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.title = options.title || "Erro";
    this.statusCode = options.statusCode || 500;
    this.details = options.details;
    this.timestamp = new Date();
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      title: this.title,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }

  toString() {
    return `[${this.name}] ${this.title}: ${this.message}`;
  }
}

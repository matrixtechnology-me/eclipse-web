import { CustomError } from "./custom";

export class NotFoundError extends CustomError {
  statusCode: number;
  title: string;
  message: string;

  constructor(options: { title?: string; message?: string } = {}) {
    const {
      title = "Recurso não encontrado",
      message = "O item solicitado não foi encontrado em nosso sistema.",
    } = options;

    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.title = title;
    this.message = message;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      title: this.title,
      message: this.message,
      stack: this.stack,
    };
  }
}

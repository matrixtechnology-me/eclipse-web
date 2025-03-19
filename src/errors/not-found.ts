import { CustomError } from "./custom";

export class NotFoundError extends CustomError {
  statusCode: number;

  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

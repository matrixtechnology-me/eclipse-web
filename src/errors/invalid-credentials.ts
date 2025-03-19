import { CustomError } from "./custom";

export class InvalidCredentialsError extends CustomError {
  constructor(message: string = "Invalid email or password") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

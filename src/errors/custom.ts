export class CustomError extends Error {
  statusCode: number;

  constructor(message: string = "An error occurred", statusCode: number = 400) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
  }
}

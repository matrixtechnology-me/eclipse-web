import { HttpError } from "../http.error";

export class InternalServerError extends HttpError {
  constructor(
    message = "Internal Server Error",
    metadata?: Record<string, unknown>
  ) {
    super(500, message, metadata);
  }
}

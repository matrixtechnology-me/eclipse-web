import { failure, ServerActionResult } from "@/core/server-actions";
import { HttpError } from "@/errors/http.error";

export const propagateError = <T = never>(
  error: unknown
): ServerActionResult<T> => {
  if (error instanceof HttpError) {
    return failure(error);
  }

  if (error instanceof Error) {
    return failure(
      new HttpError(500, error.message, {
        originalError: {
          name: error.name,
          stack: error.stack,
        },
      }).withName(error.name)
    );
  }

  return failure(
    new HttpError(500, "Ocorreu um erro inesperado.", {
      originalError: String(error),
    }).withName("UnexpectedError")
  );
};

declare module "@/errors/http.error" {
  interface HttpError {
    withName(name: string): this;
  }
}

HttpError.prototype.withName = function (name: string) {
  this.name = name;
  return this;
};

import { HttpError } from "@/errors/http.error";

export class Success<T> {
  readonly isSuccess = true as const;
  readonly isFailure = false as const;

  constructor(public readonly value: T) {}

  toPlainObject() {
    return {
      isSuccess: true,
      value: this.value,
    };
  }
}

export class Failure<E extends HttpError> {
  readonly isSuccess = false as const;
  readonly isFailure = true as const;

  constructor(public readonly error: E) {}

  toPlainObject() {
    return {
      isSuccess: false,
      error: {
        name: this.error.name,
        message: this.error.message,
        statusCode: this.error.statusCode,
        ...(this.error.metadata && { metadata: this.error.metadata }),
      },
    };
  }
}

export type Either<E extends HttpError, S> = Failure<E> | Success<S>;

export const fail = <E extends HttpError>(error: E): Failure<E> =>
  new Failure(error);
export const succeed = <S>(value: S): Success<S> => new Success(value);

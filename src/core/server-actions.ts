import { HttpError } from "@/errors/http.error";

export type ServerActionError = HttpError & {
  metadata?: Record<string, unknown>;
};

export type ServerActionPayload<T> = T;

export type ServerActionResultSuccess<T> = {
  isSuccess: true;
  isFailure: false;
  value: T;
};

export type ServerActionResultFailure<E extends ServerActionError> = {
  isSuccess: false;
  isFailure: true;
  error: {
    name: string;
    message: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
  };
};

export type ServerActionResult<
  T,
  E extends ServerActionError = ServerActionError
> = ServerActionResultSuccess<T> | ServerActionResultFailure<E>;

export type ServerAction<P = unknown, R = unknown> = (
  payload: ServerActionPayload<P>
) => Promise<ServerActionResult<R>>;

export const success = <T>(data: T): ServerActionResult<T> => ({
  isSuccess: true,
  isFailure: false,
  value: data,
});

export const failure = <E extends ServerActionError>(
  error: E
): ServerActionResult<never, E> => ({
  isSuccess: false,
  isFailure: true,
  error: {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    ...(error.metadata && { metadata: error.metadata }),
  },
});

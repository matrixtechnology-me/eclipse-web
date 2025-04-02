import { HttpError } from "@/errors/http.error";

export type ServerActionError = HttpError & {
  metadata?: Record<string, unknown>;
};

export type ServerActionPayload<T> = T;

export type ServerActionResult<T, E extends HttpError = ServerActionError> = {
  isSuccess: boolean;
  value?: T;
  error?: {
    name: string;
    message: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
  };
};

export type ServerAction<P = unknown, R = unknown> = (
  payload: ServerActionPayload<P>
) => Promise<ServerActionResult<R>>;

export const success = <T>(data: T): ServerActionResult<T> => ({
  isSuccess: true,
  value: data,
});

export const failure = <E extends ServerActionError>(
  error: E
): ServerActionResult<never, E> => ({
  isSuccess: false,
  error: {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    ...(error.metadata && { metadata: error.metadata }),
  },
});

export const createActionError = (
  statusCode: number,
  name: string,
  message: string,
  metadata?: Record<string, unknown>
): ServerActionError => {
  return new HttpError(statusCode, message, { ...metadata, errorName: name });
};

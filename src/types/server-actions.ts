export type ServerActionPayload<T> = T;

export type ServerActionSuccessResult<T> = {
  data: T;
};

export type ServerActionErrorResult = {
  error: string;
  statusCode: number;
  message: string;
};

export type ServerActionResult<T> =
  | ServerActionSuccessResult<T>
  | ServerActionErrorResult;

export type ServerAction<P = unknown, R = unknown> = (
  payload?: ServerActionPayload<P>
) => Promise<ServerActionResult<R>>;

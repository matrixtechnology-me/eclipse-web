import { HttpError } from "@/errors/http.error";

export type ActionError = HttpError;

export type ActionPayload<T> = T;

export type ActionResultSuccess<T> = {
  isSuccess: true;
  isFailure: false;
  value: T;
  metadata?: Record<string, any>;
};

export type ActionResultFailure<E extends ActionError> = {
  isSuccess: false;
  isFailure: true;
  error: {
    name: string;
    message: string;
    statusCode?: number;
  };
  metadata?: Record<string, any>;
};

export type ActionResult<T, E extends ActionError = ActionError> =
  | ActionResultSuccess<T>
  | ActionResultFailure<E>;

export type Action<P = unknown, R = unknown> = (
  payload: ActionPayload<P>
) => Promise<ActionResult<R>>;

export const success = <T>(
  data: T,
  metadata?: Record<string, any>
): ActionResult<T> => ({
  isSuccess: true,
  isFailure: false,
  value: data,
  metadata,
});

export const failure = <E extends ActionError>(
  error: E
): ActionResult<never, E> => {
  const { name, message, statusCode, ...rest } = error as any;

  return {
    isSuccess: false,
    isFailure: true,
    error: {
      name,
      message,
      statusCode,
    },
    metadata: rest.metadata,
  };
};

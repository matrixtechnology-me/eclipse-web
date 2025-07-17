export type EitherSuccess<T> = {
  isSuccess: true;
  isFailure: false;
  data: T;
};

export type EitherFailure<F extends Error> = {
  isSuccess: false;
  isFailure: true;
  error: F;
};

export type EitherResult<S, F extends Error> =
  | EitherSuccess<S>
  | EitherFailure<F>;

export const success = <S>(data: S): EitherResult<S, never> => ({
  isSuccess: true,
  isFailure: false,
  data,
});

export const failure = <F extends Error>(error: F): EitherResult<never, F> => {
  return {
    isSuccess: false,
    isFailure: true,
    error,
  };
};

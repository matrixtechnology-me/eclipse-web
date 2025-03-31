import { ApplicationError } from "@/errors/application";
import { ServerActionErrorResult } from "@/types/server-actions";

export const propagateError = (error: unknown): ServerActionErrorResult => {
  if (error instanceof ApplicationError) {
    return {
      error: error.name,
      message: error.message,
      title: error.title,
      statusCode: error.statusCode,
      details: error.details as string,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.name,
      message: error.message,
    };
  }

  return {
    error: "UnknownError",
    message: "Ocorreu um erro inesperado.",
  };
};

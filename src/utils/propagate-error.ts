import { ServerActionErrorResult } from "@/types/server-actions";

export const propagateError = (error: Error): ServerActionErrorResult => {
  return {
    error: error.name,
    message: error.message,
  };
};

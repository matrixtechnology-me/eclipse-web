import { InternalServerError } from "@/errors/http/internal-server.error";

export const reportError = (error: unknown) => {
  console.error("Unexpected error:", error);
  return new InternalServerError().toJSON();
};

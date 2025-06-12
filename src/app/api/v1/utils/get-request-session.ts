import { NextRequest } from "next/server";

export type RequestSession = {
  tenantId: string,
  apiKey: string,
};

type GetRequestSessionReturnValue =
  { session: RequestSession, errorMessage: null }
  | { session: null, errorMessage: string };

export const getRequestSession = (request: NextRequest):
  GetRequestSessionReturnValue => {
  const headers = request.headers;
  const authorization = headers.get("authorization");

  if (!authorization) return {
    errorMessage: "Authorization header missing",
    session: null,
  };

  const [authType, authToken] = authorization.split(" ");

  if (authType !== "Basic") return {
    errorMessage: "Invalid auth type. Use Basic Auth",
    session: null,
  };

  const decodedToken = Buffer.from(authToken, "base64").toString("utf-8");

  const [tenantId, apiKey] = decodedToken.split(":");

  const isValidKey = apiKey === process.env.API_KEY;

  if (!isValidKey) return {
    errorMessage: "Invalid API Key",
    session: null,
  };

  return {
    session: { tenantId, apiKey },
    errorMessage: null,
  };
}
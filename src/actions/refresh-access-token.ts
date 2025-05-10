"use server";

import { Action, success, failure } from "@/core/action";
import { InternalServerError, InvalidCredentialsError } from "@/errors";
import { JwtService } from "@/services/jwt.service";

type RefreshAccessTokenActionPayload = {
  refreshToken: string;
};

type RefreshAccessTokenActionResult = { accessToken: string };

export const refreshAccessTokenAction: Action<
  RefreshAccessTokenActionPayload,
  RefreshAccessTokenActionResult
> = async ({ refreshToken }) => {
  try {
    if (!refreshToken) {
      return failure(new InvalidCredentialsError("Refresh token is missing"));
    }

    const jwtService = new JwtService();

    const newAccessToken = await jwtService.sign({ sub: "uuid" }, "15m");

    return success({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("Unable to refresh access token"));
  }
};

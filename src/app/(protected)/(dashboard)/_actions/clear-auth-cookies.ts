"use server";

import { COOKIE_KEYS } from "@/config/cookie-keys";
import { Action, failure, success } from "@/core/action";
import { InternalServerError } from "@/errors";
import { cookies } from "next/headers";

export const clearAuthCookiesAction: Action = async () => {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS);
    cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH);
    cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.TENANT);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("cannot clear all cookies"));
  }
};

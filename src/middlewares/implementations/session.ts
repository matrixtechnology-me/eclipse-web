import { COOKIE_KEYS } from "@/config/cookie-keys";
import { MiddlewareChainContext } from "../chain-context";
import { Middleware } from "../middleware";
import { JwtService } from "@/services/jwt.service";
import { NextResponse } from "next/server";

/*
  Validate the User session and attempts to refresh It when necessary.
  Must always set auth cookies on response object when there is a session.
*/

export class SessionMiddleware extends Middleware {
  async shouldExecute(): Promise<boolean> {
    // Session middleware must always run.
    return true;
  }

  async execute(ctx: MiddlewareChainContext): Promise<NextResponse | void> {
    const cookies = ctx.getRequestObject().cookies;

    const accessToken = cookies.find(
      (c) => c.name === COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS
    )?.value;

    const refreshToken = cookies.find(
      (c) => c.name === COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH
    )?.value;

    // Chain continues without session (unauthenticated).
    if (!accessToken || !refreshToken) return;

    const jwtService = new JwtService();

    const payload = await jwtService.verify(accessToken);

    ctx.setSession({ id: payload.sub as string });
  }
}

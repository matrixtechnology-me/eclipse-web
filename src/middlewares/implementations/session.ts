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

    const jwtService = new JwtService(process.env.JWT_SECRET ?? "");

    // Chain continues with session (user is logged, valid accessToken).
    if (!jwtService.isAccessExpired()) {
      ctx.addResponseCookie(
        COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS,
        accessToken
      );
      ctx.addResponseCookie(
        COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH,
        refreshToken
      );

      const { sub } = jwtService.getAccessPayload();
      ctx.setSession({ id: sub as string });
      return;
    }

    // Chain continues without session (session lost).
    if (jwtService.isRefreshExpired()) return;

    // refreshToken still valid. A refresh attempt is made.
    const refreshed = await jwtService.attemptRefresh();

    // Chain continues without session (unable to refresh).
    if (!refreshed) return;

    // Chain continues with session (user is logged, session refreshed).
    // Set updated tokens refreshed by JwtService.
    ctx.addResponseCookie(
      COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS,
      jwtService.getAccessToken()
    );
    ctx.addResponseCookie(
      COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH,
      jwtService.getRefreshToken()
    );

    const { sub } = jwtService.getAccessPayload();
    ctx.setSession({ id: sub as string });
  }
}

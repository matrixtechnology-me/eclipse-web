import { publicPaths, PATHS } from "@/config/paths";
import { MiddlewareChainContext } from "../chain-context";
import { Middleware } from "../middleware";
import { NextResponse } from "next/server";

/*
  Prevents unauthenticated Users reaching a protected route.
  Should only run on protected routes.
  Must always be executed after SessionMiddleware.
*/

export class ProtectedRoutesMiddleware extends Middleware {
  async shouldExecute(): Promise<boolean> {
    // Should only run on protected routes.
    return true;
  }

  async execute(ctx: MiddlewareChainContext): Promise<NextResponse | void> {
    const session = ctx.getSession();
    const { pathname, baseURL } = ctx.getRequestObject();

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (session && !isPublicPath) return;
    if (!session && isPublicPath) return;

    if (isPublicPath && session)
      return NextResponse.redirect(
        baseURL + PATHS.PROTECTED.DASHBOARD.HOMEPAGE
      );

    return NextResponse.redirect(
      baseURL +
        PATHS.PUBLIC.AUTH.SIGN_IN +
        "?fallback=" +
        encodeURIComponent(pathname)
    );
  }
}

/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server';
import { MiddlewareChainContext } from './chain-context';

/*
  This is the base class for every Next BFF middleware.
  It must be managed in a chain by the MiddlewareChainManager.
*/

export abstract class Middleware {
  // Defines if this middleware should be executed.
  // Useful when filtering middlewares by request scope.
  abstract shouldExecute(ctx: MiddlewareChainContext): Promise<boolean>;

  // Executes the middleware and returns some potential value.
  abstract execute(ctx: MiddlewareChainContext): Promise<NextResponse | void>;
}

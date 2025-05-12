import { MiddlewareChainContext } from "./chain-context";
import { Middleware } from "./middleware";

/*
  This class will manage Next middlewares across the application.
  It will execute the middleware chain and return a response whether necessary.
*/

export class MiddlewareChainManager {
  private middlewares: Middleware[] = [];

  public add(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  public addBefore(middleware: Middleware, beforeClass: string) {
    const beforeIndex = this.middlewares.findIndex(
      (middleware) => middleware.constructor.name === beforeClass
    );

    if (beforeIndex === -1)
      throw new Error(`Middleware ${beforeClass} is not in the chain`);

    const beginItems = this.middlewares.slice(0, beforeIndex);
    const endItems = this.middlewares.slice(
      beforeIndex,
      this.middlewares.length
    );

    this.middlewares = [...beginItems, middleware, ...endItems];
  }

  public addAfter(middleware: Middleware, afterClass: string) {
    const afterIndex = this.middlewares.findIndex(
      (middleware) => middleware.constructor.name === afterClass
    );

    if (afterIndex === -1)
      throw new Error(`Middleware ${afterClass} is not in the chain`);

    const beginItems = this.middlewares.slice(0, afterIndex + 1);
    const endItems = this.middlewares.slice(
      afterIndex + 1,
      this.middlewares.length
    );

    this.middlewares = [...beginItems, middleware, ...endItems];
  }

  // Executes the middlewares in order.
  // Stops the chain execution if some NextResponse is returned.
  async executeChain(ctx: MiddlewareChainContext) {
    for (const middleware of this.middlewares) {
      if (await middleware.shouldExecute(ctx)) {
        const response = await middleware.execute(ctx);

        if (response) return response;
      }
    }
  }
}

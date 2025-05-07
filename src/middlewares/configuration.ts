import { MiddlewareChainManager } from './chain-manager';
import { ProtectedRoutesMiddleware } from './implementations/protected-routes';
import { SessionMiddleware } from './implementations/session';

const chainManager = new MiddlewareChainManager();

chainManager.add(new SessionMiddleware());
chainManager.addAfter(new ProtectedRoutesMiddleware(), SessionMiddleware.name);

export { chainManager };

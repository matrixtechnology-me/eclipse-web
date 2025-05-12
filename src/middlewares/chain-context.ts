import { NextRequest } from 'next/server';

export type MiddlewareCookie = {
  name: string;
  value: string;
};

type MiddlewareRequestObject = {
  URL: string;
  baseURL: string;
  pathname: string;
  cookies: MiddlewareCookie[];
};

type MiddlewareResponseObject = {
  cookies: MiddlewareCookie[];
};

type MiddlewareSessionObject = {
  id: string;
};

/*
  This class holds the data shared across middlewares in a normalized way.
  Changes to its strucutre may affect other middlewares.
*/

export class MiddlewareChainContext {
  private _request: MiddlewareRequestObject;
  private readonly _response: MiddlewareResponseObject;
  private _session: MiddlewareSessionObject | null;

  constructor(req: NextRequest) {
    const nextURL = req.nextUrl.clone();
    const reqCookies = req.cookies.getAll() as MiddlewareCookie[];
    const baseURL = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    this._session = null;
    this._response = { cookies: [] };
    this._request = {
      baseURL: baseURL.toString(),
      URL: nextURL.toString(),
      pathname: nextURL.pathname,
      cookies: reqCookies,
    };
  }

  public getSession() {
    return this._session;
  }

  public setSession(session: MiddlewareSessionObject) {
    this._session = session;
  }

  public getRequestObject() {
    return this._request;
  }

  public setUrl(URL: string, pathname: string) {
    this._request = {
      ...this._request,
      URL,
      pathname,
    };
  }

  public addRequestCookie(name: string, value: string) {
    this._request.cookies.push({ name, value });
  }

  public removeRequestCookie(name: string) {
    this._request.cookies = this._request.cookies.filter(
      (cookie) => cookie.name !== name
    );
  }

  public getResponseObject() {
    return this._response;
  }

  public addResponseCookie(name: string, value: string) {
    this._response.cookies.push({ name, value });
  }

  public removeResponseCookie(name: string) {
    this._response.cookies = this._response.cookies.filter(
      (cookie) => cookie.name !== name
    );
  }
}

"use server";

import { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";

export async function renderJsxToHtmlString(
  element: ReactElement
): Promise<string> {
  const htmlString = renderToStaticMarkup(element);
  return htmlString;
}

import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const headers = request.headers;
  const authorization = headers.get("authorization");

  if (!authorization || authorization !== process.env.API_KEY)
    return Response.json({ message: "Invalid API Key" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get("tag");

  revalidateTag(tag ?? "");

  return Response.json({ message: "ok" });
};

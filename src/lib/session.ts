"use server";

import { cookies } from "next/headers";

export const getServerSession = async () => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("X-Identity")?.value;

  if (!sessionId) return null;

  return { id: sessionId };
};

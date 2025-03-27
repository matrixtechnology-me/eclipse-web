"use server";

import { cookies } from "next/headers";

export const getServerSession = async () => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("X-Identity")?.value;
  const tenantId = cookieStore.get("X-Tenant")?.value;

  if (!sessionId || !tenantId) return null;

  return { id: sessionId, tenantId };
};

"use server";

import { cookies } from "next/headers";

type SessionRequirements = {
  tenant: boolean;
};

type SessionOptions = {
  requirements: SessionRequirements;
};

const defaultOptions = { requirements: { tenant: false } };

type SessionReturnType<TOptions extends SessionOptions> =
  TOptions["requirements"]["tenant"] extends true
    ? { id: string; tenantId: string } | null
    : { id: string; tenantId?: string } | null;

export const getServerSession = async <
  TOptions extends SessionOptions = typeof defaultOptions
>(
  options: TOptions = defaultOptions as TOptions
): Promise<SessionReturnType<TOptions>> => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("X-Identity")?.value;
  const tenantId = cookieStore.get("X-Tenant")?.value;

  if (!sessionId) return null as SessionReturnType<TOptions>;

  if (options.requirements.tenant && !tenantId)
    return null as SessionReturnType<TOptions>;

  return {
    id: sessionId,
    ...(tenantId && { tenantId }),
  } as SessionReturnType<TOptions>;
};

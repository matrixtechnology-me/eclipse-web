"use server";

import { cookies } from "next/headers";
import { JwtService } from "@/services/jwt.service";
import { COOKIE_KEYS } from "@/config/cookie-keys";

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

  const accessToken = cookieStore.get(
    COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS
  )?.value;
  const tenantId = cookieStore.get(COOKIE_KEYS.AUTHENTICATION.TENANT)?.value;

  if (!accessToken) return null as SessionReturnType<TOptions>;

  try {
    const jwtService = new JwtService(process.env.JWT_SECRET as string);
    const payload = await jwtService.verify(accessToken);

    const sessionId = payload.sub as string | undefined;
    if (!sessionId) return null as SessionReturnType<TOptions>;

    if (options.requirements.tenant && !tenantId)
      return null as SessionReturnType<TOptions>;

    return {
      id: sessionId,
      ...(tenantId && { tenantId }),
    } as SessionReturnType<TOptions>;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null as SessionReturnType<TOptions>;
  }
};

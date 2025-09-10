"use server";

import { COOKIE_KEYS } from "@/config/cookie-keys";
import { PATHS } from "@/config/paths";
import { Action, failure, success } from "@/lib/action";
import {
  InternalServerError,
  InvalidCredentialsError,
  NotFoundError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { HashingService } from "@/services/hashing.service";
import { JwtService } from "@/services/jwt.service";
import { CircleHelpIcon } from "lucide-react";
import { cookies } from "next/headers";

type AuthenticateUserActionPayload = {
  email: string;
  password: string;
};

type AuthenticateUserActionResult = {
  href: string;
};

export const authenticateUserAction: Action<
  AuthenticateUserActionPayload,
  AuthenticateUserActionResult
> = async ({ email, password }) => {
  const log = (...args: any[]) =>
    console.log("[authenticateUserAction]", ...args);

  try {
    log("Iniciando autenticação", { email });
    if (!email || !password) {
      log("Email ou senha não informados");
      return failure(
        new InvalidCredentialsError("Email and password are required", {
          attributes: {
            title: "Credenciais inválidas",
            description: "Informe e-mail e senha para continuar.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    log("Buscando usuário no banco de dados");
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        active: true,
        firstAccess: true,
      },
    });

    if (!user) {
      log("Usuário não encontrado");
      return failure(
        new NotFoundError("User not found", {
          attributes: {
            title: "Usuário não encontrado",
            description: "Verifique seu e-mail e tente novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    if (!user.active) {
      log("Conta do usuário está desativada");
      return failure(
        new InvalidCredentialsError("User account is inactive", {
          attributes: {
            title: "Conta desativada",
            description:
              "Sua conta está desativada. Entre em contato com o suporte.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    log("Verificando senha");
    const hashingService = new HashingService();
    const passwordMatch = await hashingService.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) {
      log("Senha incorreta");
      return failure(
        new InvalidCredentialsError("Invalid credentials", {
          attributes: {
            title: "Credenciais inválidas",
            description: "E-mail ou senha incorretos. Tente novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    log("Senha correta, gerando tokens e cookies");
    const jwtService = new JwtService();
    const cookieStore = await cookies();

    const sessionToken = await jwtService.sign(
      { sub: user.id, type: "access" },
      "5m"
    );

    cookieStore.set({
      name: COOKIE_KEYS.AUTHENTICATION.TOKENS.SESSION,
      value: sessionToken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    if (user.firstAccess) {
      log("Primeiro acesso detectado, redirecionando para onboarding");
      return success({ href: PATHS.PUBLIC.AUTH.FIRST_ACCESS });
    }

    const [accessToken, refreshToken] = await Promise.all([
      await jwtService.sign({ sub: user.id, type: "access" }, "1h"),
      await jwtService.sign({ sub: user.id, type: "refresh" }, "30d"),
    ]);

    cookieStore.set({
      name: COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS,
      value: accessToken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set({
      name: COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH,
      value: refreshToken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    log("Buscando tenant do usuário");
    const tenant = await prisma.tenant.findFirst({
      where: {
        memberships: {
          some: {
            membership: {
              userId: user.id,
            },
          },
        },
        active: true,
      },
      select: {
        id: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!tenant) {
      log("Nenhum tenant encontrado, redirecionando para onboarding");
      return success({ href: PATHS.PROTECTED.GET_STARTED });
    }

    cookieStore.set({
      name: COOKIE_KEYS.AUTHENTICATION.TENANT,
      value: tenant.id,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    log("Autenticação finalizada com sucesso, redirecionando para dashboard");
    return success({ href: PATHS.PROTECTED.DASHBOARD.HOMEPAGE });
  } catch (error: unknown) {
    log("Erro inesperado", error);
    return failure(
      new InternalServerError("Unable to authenticate user", {
        attributes: {
          title: "Erro no servidor",
          description:
            "Ocorreu um erro inesperado ao tentar fazer login. Tente novamente mais tarde.",
          icon: <CircleHelpIcon className="size-4" />,
        },
      })
    );
  }
};

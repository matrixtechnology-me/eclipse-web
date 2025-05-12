"use server";

import { COOKIE_KEYS } from "@/config/cookie-keys";
import { PATHS } from "@/config/paths";
import { Action, failure, success } from "@/core/action";
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
  try {
    if (!email || !password) {
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

    const hashingService = new HashingService();

    const passwordMatch = await hashingService.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
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
      return success({ href: PATHS.PROTECTED.GET_STARTED });
    }

    cookieStore.set({
      name: COOKIE_KEYS.AUTHENTICATION.TENANT,
      value: tenant.id,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return success({ href: PATHS.PROTECTED.DASHBOARD.HOMEPAGE });
  } catch (error: unknown) {
    console.error(error);
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

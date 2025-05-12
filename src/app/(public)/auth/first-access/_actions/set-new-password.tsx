"use server";

import { Action, failure, success } from "@/core/action";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { HashingService } from "@/services/hashing.service";
import { PATHS } from "@/config/paths";
import { CircleHelpIcon } from "lucide-react";
import { COOKIE_KEYS } from "@/config/cookie-keys";
import { JwtService } from "@/services/jwt.service";
import { cookies } from "next/headers";
import moment from "moment";

type SetNewPasswordPayload = {
  password: string;
};

type SetNewPasswordResult = {
  href: string;
};

export const setNewPasswordAction: Action<
  SetNewPasswordPayload,
  SetNewPasswordResult
> = async ({ password }) => {
  try {
    const jwtService = new JwtService();
    const cookieStore = await cookies();

    const sessionToken =
      cookieStore.get(COOKIE_KEYS.AUTHENTICATION.TOKENS.SESSION)?.value ?? "";

    const payload = await jwtService.verify(sessionToken);
    const sessionExpDate = moment.unix(payload.exp as number);
    const isSessionExpired = sessionExpDate.isBefore(moment());

    if (!payload || isSessionExpired) {
      return failure(
        new UnauthorizedError("Missing session token", {
          attributes: {
            title: "Sessão expirada",
            description: "Faça login novamente para redefinir sua senha.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    if (!payload) {
      return failure(
        new UnauthorizedError("Invalid session token", {
          attributes: {
            title: "Sessão inválida",
            description: "Sua sessão não é válida. Faça login novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const userId = payload.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, active: true },
    });

    if (!user) {
      return failure(
        new NotFoundError("User not found", {
          attributes: {
            title: "Usuário não encontrado",
            description: "Não foi possível redefinir a senha. Tente novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    if (!user.active) {
      return failure(
        new UnauthorizedError("Inactive account", {
          attributes: {
            title: "Conta desativada",
            description:
              "Sua conta está inativa. Entre em contato com o suporte.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const hashingService = new HashingService();
    const hashedPassword = await hashingService.hashPassword(password);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        firstAccess: false,
      },
    });

    return success({
      href: PATHS.PUBLIC.AUTH.SIGN_IN,
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Unable to set new password", {
        attributes: {
          title: "Erro ao definir senha",
          description:
            "Ocorreu um erro ao salvar a nova senha. Tente novamente mais tarde.",
          icon: <CircleHelpIcon className="size-4" />,
        },
      })
    );
  }
};

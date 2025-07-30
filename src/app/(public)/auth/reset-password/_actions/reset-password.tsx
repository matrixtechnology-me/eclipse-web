"use server";
import { Action, success, failure } from "@/lib/action";
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { HashingService } from "@/services/hashing.service";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/config/cookie-keys";
import moment from "moment";

type ResetPasswordActionPayload = {
  password: string;
};

type ResetPasswordActionResult = {};

export const resetPasswordAction: Action<
  ResetPasswordActionPayload,
  ResetPasswordActionResult
> = async ({ password }) => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(
      COOKIE_KEYS.AUTHENTICATION.SESSION
    )?.value;
    if (!sessionId) {
      return failure(
        new UnauthorizedError("Sessão não encontrada", {
          attributes: {
            title: "Sessão inválida",
            description: "Por favor, inicie o processo novamente.",
          },
        })
      );
    }
    const session = await prisma.session.findUnique({
      where: { id: sessionId, revokedAt: null },
    });
    if (!session || session.type !== "PasswordRecovery") {
      return failure(
        new UnauthorizedError("Sessão inválida", {
          attributes: {
            title: "Sessão inválida",
            description: "Por favor, inicie o processo novamente.",
          },
        })
      );
    }

    if (moment(session.expiresAt).isBefore(moment())) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });

      cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.SESSION);

      return failure(
        new UnauthorizedError("Sessão expirada", {
          attributes: {
            title: "Sessão expirada",
            description: "Por favor, solicite um novo código de verificação.",
          },
        })
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return failure(
        new NotFoundError("Usuário não encontrado", {
          attributes: {
            title: "Usuário não encontrado",
            description: "Não foi possível redefinir a senha. Tente novamente.",
          },
        })
      );
    }

    if (!user.active) {
      return failure(
        new UnauthorizedError("Conta inativa", {
          attributes: {
            title: "Conta desativada",
            description:
              "Sua conta está inativa. Entre em contato com o suporte.",
          },
        })
      );
    }

    const hashingService = new HashingService();
    const hashedPassword = await hashingService.hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.SESSION);
    return success({});
  } catch (error) {
    return failure(new InternalServerError("Erro ao redefinir senha"));
  }
};

"use server";

import { COOKIE_KEYS } from "@/config/cookie-keys";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import { generateFingerprint } from "@/lib/fingerprint";
import prisma from "@/lib/prisma";
import { ESessionType } from "@prisma/client";
import { CircleHelpIcon } from "lucide-react";
import moment from "moment";
import { cookies } from "next/headers";

type VerifyCodeActionPayload = {
  verificationCodeValue: string;
};

export const verifyCodeAction: Action<VerifyCodeActionPayload> = async ({
  verificationCodeValue,
}: VerifyCodeActionPayload) => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(
      COOKIE_KEYS.AUTHENTICATION.SESSION
    )?.value;

    if (!sessionId) {
      return failure(
        new NotFoundError("Session checksum not found", {
          attributes: {
            title: "Sessão não encontrada",
            description: "Por favor, inicie o processo novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
        revokedAt: null,
      },
    });

    if (!session) {
      return failure(
        new NotFoundError("Session not found", {
          attributes: {
            title: "Sessão não encontrada",
            description: "Por favor, inicie o processo novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.$transaction(async (tx) => {
        await tx.session.update({
          where: {
            id: session.id,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      });

      cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.SESSION);

      return failure(
        new BadRequestError("Session expired", {
          attributes: {
            title: "Sessão expirada",
            description: "Por favor, inicie o processo novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const verificationCode = await prisma.verificationCode.findUnique({
      where: {
        value: verificationCodeValue,
      },
    });

    if (!verificationCode) {
      return failure(
        new NotFoundError("Verification code not found", {
          attributes: {
            title: "Código de verificação não encontrado",
            description: "Verifique o código e tente novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
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

    if (verificationCode.expiresAt < new Date()) {
      prisma.$transaction(async (tx) => {
        await tx.verificationCode.delete({
          where: {
            id: verificationCode.id,
          },
        });

        await tx.session.update({
          where: {
            id: session.id,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      });

      cookieStore.delete(COOKIE_KEYS.AUTHENTICATION.SESSION);

      return failure(
        new BadRequestError("Verification code expired", {
          attributes: {
            title: "Código de verificação expirado",
            description: "Por favor, solicite um novo código.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    if (verificationCodeValue !== verificationCode.value) {
      return failure(
        new BadRequestError("Invalid verification code", {
          attributes: {
            title: "Código de verificação inválido",
            description: "Por favor, verifique o código e tente novamente.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );
    }

    const deviceFingerprint = await generateFingerprint();

    const resetCodeSession = await prisma.session.create({
      data: {
        fingerprint: deviceFingerprint,
        userId: session.userId,
        type: ESessionType.PasswordRecovery,
        expiresAt: moment().add(15, "minutes").toDate(),
      },
    });

    cookieStore.set(COOKIE_KEYS.AUTHENTICATION.SESSION, resetCodeSession.id);

    return success(
      {},
      {
        attributes: {
          title: "Código verificado com sucesso",
          description: "Você pode resetar a sua senha.",
          icon: <CircleHelpIcon className="size-4" />,
        },
      }
    );
  } catch (error) {
    return failure(new InternalServerError());
  }
};

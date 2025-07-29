"use server";

import { ForgotPasswordTemplate } from "@/components/templates/forgot-password";
import { COOKIE_KEYS } from "@/config/cookie-keys";
import { InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import { generateFingerprint } from "@/lib/fingerprint";
import prisma from "@/lib/prisma";
import { SESService } from "@/services/aws/ses.service";
import { STSService } from "@/services/aws/sts.service";
import { ESessionType } from "@prisma/client";
import { render } from "@react-email/components";
import { CircleHelpIcon } from "lucide-react";
import moment from "moment";
import { cookies } from "next/headers";

type ForgotPasswordActionPayload = {
  email: string;
};

type ForgotPasswordActionResult = {};

export const forgotPasswordAction: Action<
  ForgotPasswordActionPayload,
  ForgotPasswordActionResult
> = async ({ email }) => {
  try {
    const cookieStore = await cookies();

    const user = await prisma.user.findUnique({
      where: {
        email,
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

    const fingerprint = await generateFingerprint();

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const session = await prisma.session.create({
      data: {
        fingerprint,
        type: ESessionType.PasswordRecovery,
        expiresAt: moment().add(30, "minutes").toDate(),
        userId: user.id,
        verificationCodes: {
          create: {
            value: verificationCode,
            expiresAt: moment().add(5, "minutes").toDate(),
          },
        },
      },
    });

    cookieStore.set(COOKIE_KEYS.AUTHENTICATION.SESSION, session.id);

    if (!process.env.AWS_ROLE_ARN)
      return failure(
        new InternalServerError("AWS Role ARN is not defined", {
          attributes: {
            title: "Erro Interno",
            description: "Ocorreu um erro ao processar sua solicitação.",
            icon: <CircleHelpIcon className="size-4" />,
          },
        })
      );

    const stsService = new STSService();
    const credentials = await stsService.assumeRole(
      process.env.AWS_ROLE_ARN,
      "forgot-password-action",
      900
    );

    const htmlTemplate = await render(
      <ForgotPasswordTemplate verificationCode={verificationCode} />
    );

    const sesService = new SESService(credentials);

    await sesService.sendEmail({
      from: "sac@matrixcorporate.com.br",
      to: email,
      subject: "Recuperação de Senha",
      htmlBody: htmlTemplate,
    });

    return success(
      {},
      {
        attributes: {
          title: "E-mail enviado",
          description: "Verifique sua caixa de entrada para instruções.",
          icon: <CircleHelpIcon className="size-4" />,
        },
      }
    );
  } catch (error) {
    return failure(
      new InternalServerError("Failed to process request", {
        attributes: {
          title: "Erro Interno",
          description: "Ocorreu um erro ao processar sua solicitação.",
          icon: <CircleHelpIcon className="size-4" />,
        },
        error: error instanceof Error ? error : new Error("Unknown error"),
      })
    );
  }
};

"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type CreateNotificationPayload = {
  type: string;
  subject: string;
  body: string;
  tenantId: string;
};

export const createNotification = async ({
  type,
  subject,
  body,
  tenantId,
}: CreateNotificationPayload) => {
  await prisma.notification.create({
    data: {
      type,
      subject,
      body,
      read: false,
      tenantId,
    },
  });

  revalidateTag(`notifications:${tenantId}`);

  return { data: {} };
};

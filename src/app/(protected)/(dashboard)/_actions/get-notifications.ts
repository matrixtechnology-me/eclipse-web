"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { ENotificationType } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetNotificationsActionPayload = {
  userId: string;
  tenantId: string;
};

type GetNotificationsActionResult = {
  notifications: {
    id: string;
    subject: string;
    body: string;
    type: ENotificationType;
    href: string;
    createdAt: Date;
  }[];
};

export const getNotificationsAction: Action<
  GetNotificationsActionPayload,
  GetNotificationsActionResult
> = async ({ tenantId, userId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.USER_TENANT(userId, tenantId).NOTIFICATIONS);

  try {
    const notifications = await prisma.notificationTarget.findMany({
      where: {
        userId,
        tenantId,
      },
      include: {
        notification: {
          select: {
            id: true,
            subject: true,
            body: true,
            type: true,
            href: true,
            createdAt: true,
          },
        },
      },
    });

    const mappedNotifications = notifications.map((n) => n.notification);

    return success({
      notifications: mappedNotifications,
    });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("unable to get notifications"));
  }
};

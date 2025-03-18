"use client";

import { FC, useEffect, useState } from "react";

type NotifyProps = {
  notifications: {
    id: string;
    type: string;
    subject: string;
    body: string;
    read: boolean;
    created_at: Date;
    updated_at: Date;
  }[];
};

export const Notify: FC<NotifyProps> = ({ notifications }) => {
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => setIsUserInteracted(true);
    window.addEventListener("click", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (isUserInteracted) {
      const unreadNotification = notifications.find(
        (notification) => !notification.read
      );

      console.log(notifications);

      if (unreadNotification) {
        const audio = new Audio("./notification.mp3");
        audio.play().catch(console.error);
      }
    }
  }, [notifications, isUserInteracted]);

  return <div />;
};

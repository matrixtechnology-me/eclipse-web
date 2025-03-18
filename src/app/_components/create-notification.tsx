"use client";

import { createNotification } from "../_actions/create-notification";

export const CreateNotification = () => {
  const handleCreateNotification = async () => {
    await createNotification({
      type: "SUPPORT",
      body: "Esta é uma notificação de teste",
      subject: "Notificação",
    });
  };

  return <button onClick={handleCreateNotification}>Nova notificação</button>;
};

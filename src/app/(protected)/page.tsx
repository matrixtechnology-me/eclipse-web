import { Suspense } from "react";
import { getNotifications } from "../_actions/get-notifications";
import { Notifications } from "../_components/notifications";
import { CreateNotification } from "../_components/create-notification";

export default async function Home() {
  const result = await getNotifications({ userId: "" });

  if ("error" in result) {
    return <div>Erro ao carregar as notificações</div>;
  }

  const { notifications } = result.data;

  return (
    <Suspense>
      <CreateNotification />
      <Notifications notifications={notifications} />
    </Suspense>
  );
}

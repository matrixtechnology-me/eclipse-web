import { FC } from "react";

export const Alerts: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="font-bold">Alertas</h1>
        <p className="text-xs text-muted-foreground">
          Aqui você encontrará notificações importantes e atualizações sobre o
          sistema.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-64 rounded-lg border border-dashed">
        <span className="text-sm text-muted-foreground">
          Sem alertas no momento
        </span>
      </div>
    </div>
  );
};

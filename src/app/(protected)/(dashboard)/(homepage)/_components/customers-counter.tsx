import { ServerActionResult } from "@/types/server-actions";
import { GetCustomersCountActionResult } from "../_actions/get-customers-count";
import { FC } from "react";
import { UsersIcon } from "lucide-react";

type CustomersCounterProps = {
  either: ServerActionResult<GetCustomersCountActionResult>;
};

export const CustomersCounter: FC<CustomersCounterProps> = ({ either }) => {
  if ("error" in either) {
    return <div>Não foi possível carregar contador de clientes</div>;
  }

  const { count } = either.data;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <UsersIcon className="size-4" />
        </div>
        <span className="font-bold">{count}</span>
      </div>
      <div>
        <h1>Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Seu total de clientes ativos
        </p>
      </div>
    </div>
  );
};

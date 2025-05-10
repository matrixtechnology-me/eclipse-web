import { FC } from "react";
import { UsersIcon } from "lucide-react";
import { ActionResult } from "@/core/action";
import { GetCustomersCountActionResult } from "../_actions/get-customers-count";

type CustomersCounterProps = {
  result: ActionResult<GetCustomersCountActionResult>;
};

export const CustomersCounter: FC<CustomersCounterProps> = ({ result }) => {
  if (result.isFailure) {
    return <div>Não foi possível carregar contador de clientes</div>;
  }

  const { count } = result.value;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <UsersIcon className="size-4" />
        </div>
        <span className="text-sm md:text-md lg:text-lg font-bold">{count}</span>
      </div>
      <div>
        <h1 className="text-sm">Clientes</h1>
        <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
          Seu total de clientes ativos
        </p>
      </div>
    </div>
  );
};

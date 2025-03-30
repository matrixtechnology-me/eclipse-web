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
    <div className="flex-1 border border-secondary p-5">
      <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
        <UsersIcon className="size-4" />
      </div>
      <div>
        <h1>Clientes</h1>
        <span>{count}</span>
      </div>
    </div>
  );
};

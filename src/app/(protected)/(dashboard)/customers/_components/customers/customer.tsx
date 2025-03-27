import { CircleCheckIcon, UserIcon, XCircleIcon } from "lucide-react";
import { FC } from "react";
import type { Customer as CustomerType } from "../../_actions/get-customers";

type CustomerProps = {
  data: CustomerType;
};

export const Customer: FC<CustomerProps> = ({ data }) => {
  return (
    <div className="h-fit flex-1 border bg-secondary/25 p-5 rounded-lg flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <UserIcon className="size-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm">{data.name}</h1>
          <span className="text-xs text-muted-foreground">
            {data.phoneNumber}
          </span>
        </div>
      </div>
      <div>
        <div className="h-8 bg-secondary w-fit border px-2 rounded-md flex items-center justify-center gap-2">
          {data.active ? (
            <CircleCheckIcon className="size-4" />
          ) : (
            <XCircleIcon className="size-4" />
          )}
          <span className="text-sm">{data.active ? "Ativo" : "Inativo"}</span>
        </div>
      </div>
    </div>
  );
};

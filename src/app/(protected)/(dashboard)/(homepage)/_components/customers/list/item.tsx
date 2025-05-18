import { FC } from "react";
import { Customer } from "../../../_actions/get-customers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Progress } from "@/components/ui/progress";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type ItemProps = {
  data: Customer;
  maxTotalSpent: number;
};

export const Item: FC<ItemProps> = ({ data, maxTotalSpent }) => {
  const percent = (data.totalSpent / maxTotalSpent) * 100;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9 bg-secondary rounded-sm flex items-center justify-center">
        {data.avatarUrl ? (
          <AvatarImage src={data.avatarUrl} alt={data.name} />
        ) : (
          <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
        )}
      </Avatar>
      <div className="h-full flex-1">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-sm">{data.name}</h1>
          <span className="text-sm">
            {CurrencyFormatter.format(data.totalSpent)}
          </span>
        </div>
        <Progress value={percent} className="mt-2" />
      </div>
    </div>
  );
};

import { FC } from "react";
import { Category } from "../../../_actions/get-categories";
import { Progress } from "@/components/ui/progress";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { TagIcon } from "lucide-react";

type ItemProps = {
  data: Category;
  maxSalesTotal: number;
};

export const Item: FC<ItemProps> = ({ data, maxSalesTotal }) => {
  const percent = (data.salesTotal / maxSalesTotal) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="size-9 bg-secondary rounded-sm flex items-center justify-center">
        <TagIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="h-full flex-1">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-sm">{data.name}</h1>
          <span className="text-sm">
            {CurrencyFormatter.format(data.salesTotal)}
          </span>
        </div>
        <Progress value={percent} className="mt-2" />
      </div>
    </div>
  );
};

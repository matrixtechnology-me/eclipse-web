import { FC } from "react";
import { Category } from "../../../_actions/get-categories";
import { Item } from "./item";

type ListProps = {
  data: Category[];
  maxSalesTotal: number;
};

export const List: FC<ListProps> = ({ data, maxSalesTotal }) => {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <Item key={item.id} data={item} maxSalesTotal={maxSalesTotal} />
      ))}
    </div>
  );
};

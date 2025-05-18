import { FC } from "react";
import { Customer } from "../../../_actions/get-customers";
import { Item } from "./item";

type ListProps = {
  data: Customer[];
  maxTotalSpent: number;
};

export const List: FC<ListProps> = ({ data, maxTotalSpent }) => {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <Item key={item.id} data={item} maxTotalSpent={maxTotalSpent} />
      ))}
    </div>
  );
};

import Link from "next/link";
import { Customer } from "./customer";
import { FC } from "react";
import { PATHS } from "@/config/paths";

type ListProps = {
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const List: FC<ListProps> = ({ data }) => {
  return (
    <div className="grid lg:grid-cols-4 gap-5 grid-cols-1 overflow-y-auto lg:hidden">
      {data.map((item) => (
        <Link
          href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.CUSTOMER(item.id)}
          key={item.id}
          className="h-fit"
        >
          <Customer data={item} />
        </Link>
      ))}
    </div>
  );
};

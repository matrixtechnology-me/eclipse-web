import { PATHS } from "@/config/paths";
import Link from "next/link";
import { FC } from "react";
import { Item } from "./item";

export type ListProps = {
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  tenantId: string;
};

export const List: FC<ListProps> = ({ data, tenantId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 lg:hidden">
      {data.map((item) => (
        <Link
          href={
            PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.CATEGORY(item.id)
              .INDEX
          }
          key={item.id}
          aria-label={`Ver detalhes da categoria ${item.name}`}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <Item
            name={item.name}
            description={item.description}
            createdAt={item.createdAt}
          />
        </Link>
      ))}
    </div>
  );
};

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
      {data.map((category) => (
        <Link
          href={
            PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.CATEGORY(category.id)
              .INDEX
          }
          key={category.id}
          aria-label={`Ver detalhes da categoria ${category.name}`}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <Item
            name={category.name}
            description={category.description}
            createdAt={category.createdAt}
          />
        </Link>
      ))}
    </div>
  );
};

import { PATHS } from "@/config/paths";
import Link from "next/link";
import { FC } from "react";
import { Product } from "../product";

export type ListProps = {
  data: {
    id: string;
    name: string;
    barCode: string;
    active: boolean;
    salePrice: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  tenantId: string;
};

export const List: FC<ListProps> = ({ data, tenantId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 lg:hidden">
      {data.map((item) => (
        <Link
          href={
            PATHS.PROTECTED.DASHBOARD(tenantId).PRODUCTS.PRODUCT(item.id).INDEX
          }
          key={item.id}
          aria-label={`Ver detalhes do produto ${item.name}`}
        >
          <Product data={item} />
        </Link>
      ))}
    </div>
  );
};

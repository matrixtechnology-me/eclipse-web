import { ServerActionResult } from "@/types/server-actions";
import { GetProductsCountActionResult } from "../_actions/get-products-count";
import { FC } from "react";
import { UsersIcon } from "lucide-react";

type ProductsCounterProps = {
  either: ServerActionResult<GetProductsCountActionResult>;
};

export const ProductsCounter: FC<ProductsCounterProps> = ({ either }) => {
  if ("error" in either) {
    return <div>Não foi possível carregar contador de produtos</div>;
  }

  const { count } = either.data;

  return (
    <div className="flex-1 border border-secondary p-5">
      <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
        <UsersIcon className="size-4" />
      </div>
      <div>
        <h1>Products</h1>
        <span>{count}</span>
      </div>
    </div>
  );
};

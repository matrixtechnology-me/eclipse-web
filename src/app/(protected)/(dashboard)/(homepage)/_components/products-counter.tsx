import { ServerActionResult } from "@/core/either";
import { GetProductsCountActionResult } from "../_actions/get-products-count";
import { FC } from "react";
import { PackageIcon } from "lucide-react";

type ProductsCounterProps = {
  either: ServerActionResult<GetProductsCountActionResult>;
};

export const ProductsCounter: FC<ProductsCounterProps> = ({ either }) => {
  if ("error" in either) {
    return <div>Não foi possível carregar contador de produtos</div>;
  }

  const { count } = either.data;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <PackageIcon className="size-4" />
        </div>
        <span className="font-bold">{count}</span>
      </div>
      <div>
        <h1>Produtos</h1>
        <p className="text-sm text-muted-foreground">
          Seu portfólio disponível
        </p>
      </div>
    </div>
  );
};

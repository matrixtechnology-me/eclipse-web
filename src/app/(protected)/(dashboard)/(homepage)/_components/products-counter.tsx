import { FC } from "react";
import { PackageIcon } from "lucide-react";
import { ActionResult } from "@/lib/action";
import { GetProductsCountActionResult } from "../_actions/get-products-count";

type ProductsCounterProps = {
  result: ActionResult<GetProductsCountActionResult>;
};

export const ProductsCounter: FC<ProductsCounterProps> = ({ result }) => {
  if (result.isFailure) {
    return <div>Não foi possível carregar contador de produtos</div>;
  }

  const { count } = result.value;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <PackageIcon className="size-4" />
        </div>
        <span className="text-sm md:text-md lg:text-lg font-bold">{count}</span>
      </div>
      <div>
        <h1 className="text-sm">Produtos</h1>
        <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
          Seu portfólio disponível
        </p>
      </div>
    </div>
  );
};

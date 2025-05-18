import { FC } from "react";
import { getCategoriesAction } from "../../_actions/get-categories";
import { TagsIcon, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { List } from "./list";
import Link from "next/link";
import { PATHS } from "@/config/paths";
import { Button } from "@/components/ui/button";

type CategoriesProps = {
  tenantId: string;
};

export const Categories: FC<CategoriesProps> = async ({ tenantId }) => {
  const result = await getCategoriesAction({ tenantId });

  if (result.isFailure) {
    return <div>Não foi possível renderizar as categorias</div>;
  }

  const { categories } = result.value;

  const maxSalesTotal = Math.max(...categories.map((c) => c.salesTotal));

  return (
    <div className="h-full bg-secondary/25 rounded-sm p-5 border flex flex-col">
      <div className="h-12 flex items-center gap-3">
        <div className="size-9 bg-secondary rounded-sm flex items-center justify-center">
          <TagsIcon className="size-4" />
        </div>
        <div>
          <h1>Categorias</h1>
          <p className="text-muted-foreground text-xs">
            Maior valor em vendas processadas
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      {categories.length ? (
        <List data={categories} maxSalesTotal={maxSalesTotal} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <p className="text-sm text-muted-foreground max-w-md">
            Nenhuma venda foi registrada com categorias de produtos. Cadastre
            produtos com categorias para acompanhar suas vendas por categoria.
          </p>

          <Link href={PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX()}>
            <Button className="gap-2" variant="outline">
              <PlusIcon className="size-4" />
              Cadastrar produto
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

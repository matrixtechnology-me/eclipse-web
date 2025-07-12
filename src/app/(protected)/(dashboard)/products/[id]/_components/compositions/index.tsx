import { FC } from "react";
import { getProductCompositionsAction } from "../../_actions/get-product-compositions";
import { Table } from "./table";
import { AddComposition } from "./add-composition";

type CompositionsProps = {
  productId: string;
  tenantId: string;
};

export const Compositions: FC<CompositionsProps> = async ({
  productId,
  tenantId,
}) => {
  const result = await getProductCompositionsAction({
    productId,
    tenantId,
  });

  if (result.isFailure) return <div>Nenhuma especificação encontrada</div>;

  const { compositions } = result.value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold">Composições</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Informe todos os ingredientes ou componentes utilizados na
            fabricação deste produto.
          </p>
        </div>
        <AddComposition productId={productId} tenantId={tenantId} />
      </div>
      <Table data={compositions} productId={productId} tenantId={tenantId} />
    </div>
  );
};

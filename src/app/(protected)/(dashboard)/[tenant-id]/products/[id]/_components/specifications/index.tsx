import { FC } from "react";
import { getProductSpecificationsAction } from "../../_actions/get-product-specifications";
import { Table } from "./table";
import { AddSpecification } from "./add-specification";

type SpecificationsProps = {
  productId: string;
  tenantId: string;
};

export const Specifications: FC<SpecificationsProps> = async ({
  productId,
  tenantId,
}) => {
  const result = await getProductSpecificationsAction({
    productId,
    tenantId,
  });

  if (result.isFailure) return <div>Nenhuma especificação encontrada</div>;

  const { specifications } = result.value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold">Especificações</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Detalhes essenciais do produto, como dimensões, material e outras
            características relevantes.
          </p>
        </div>
        <AddSpecification productId={productId} tenantId={tenantId} />
      </div>
      <Table data={specifications} productId={productId} tenantId={tenantId} />
    </div>
  );
};

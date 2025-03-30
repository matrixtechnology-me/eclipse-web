import { FC } from "react";
import { LotsTable } from "./lots-table";
import { AddLot } from "./add-lot";

type LotsProps = {
  data: {
    id: string;
    totalQty: number;
    costPrice: number;
    lotNumber: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
  stockId: string;
};

export const Lots: FC<LotsProps> = ({ stockId, data }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold">Lotes</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Gerenciamento dos diferentes lotes do produto, com informações sobre
            custo, validade e disponibilidade.
          </p>
        </div>
        <AddLot stockId={stockId} />
      </div>
      <LotsTable data={data} />
    </div>
  );
};

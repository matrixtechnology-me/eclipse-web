import { Property } from "@/components/property";
import { EStockStrategy } from "@prisma/client";
import { FC } from "react";
import { AddStockEntry } from "./add-stock-entry";
import { AddStockOutput } from "./add-stock-output";

const getStockStrategyLabel = (strategy: EStockStrategy) => {
  switch (strategy) {
    case EStockStrategy.Fifo:
      return "PEPS - Primeiro a Entrar, Primeiro a Sair";
    case EStockStrategy.Lifo:
      return "UEPS - Último que Entra, Primeiro a Sair";
  }
};

type StockProps = {
  id: string;
  strategy: EStockStrategy;
  availableQty: number;
  totalQty: number;
  lots: {
    id: string;
    lotNumber: string;
    totalQty: number;
  }[];
};

export const Stock: FC<StockProps> = ({
  availableQty,
  strategy,
  totalQty,
  lots,
  id,
}) => {
  const properties = [
    {
      label: "Estratégia",
      value: getStockStrategyLabel(strategy),
      copyable: false,
    },
    {
      label: "Quantidade total",
      value: totalQty,
      copyable: false,
    },
    {
      label: "Quantidade disponível",
      value: availableQty,
      copyable: false,
    },
    {
      label: "Quantidade reservada",
      value: 0, // TODO: get this property value from order item quantities count
      copyable: false,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div />
        <div className="grid grid-cols-2 gap-2">
          <AddStockEntry stockId={id} stockLots={lots} />
          <AddStockOutput stockId={id} stockLots={lots} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {properties.map((property) => (
          <Property
            key={property.label}
            label={property.label}
            value={property.value}
            copyable={property.copyable}
          />
        ))}
      </div>
    </div>
  );
};

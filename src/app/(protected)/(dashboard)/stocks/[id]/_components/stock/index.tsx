import { Property } from "@/components/property";
import { EStockStrategy } from "@prisma/client";
import { FC } from "react";
import { Strategy } from "./strategy";

type StockProps = {
  id: string;
  strategy: EStockStrategy;
  availableQty: number;
  totalQty: number;
  tenantId: string;
};

export const Stock: FC<StockProps> = ({
  availableQty,
  strategy,
  totalQty,
  tenantId,
  id,
}) => {
  const properties = [
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Strategy initialValue={strategy} stockId={id} tenantId={tenantId} />
      {properties.map((property) => (
        <Property
          key={property.label}
          label={property.label}
          value={property.value}
          copyable={property.copyable}
        />
      ))}
    </div>
  );
};

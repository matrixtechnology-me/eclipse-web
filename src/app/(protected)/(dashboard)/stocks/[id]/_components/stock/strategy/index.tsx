"use client";

import { EStockStrategy } from "@prisma/client";
import { RefreshCcwIcon } from "lucide-react";
import { FC, useState } from "react";
import { toggleStockStrategyAction } from "../../../_actions/toggle-stock-strategy";
import { toast } from "sonner";

const getStockStrategyLabel = (strategy: EStockStrategy) => {
  switch (strategy) {
    case EStockStrategy.Fifo:
      return "PEPS - Primeiro a Entrar, Primeiro a Sair";
    case EStockStrategy.Lifo:
      return "UEPS - Último a Entrar, Primeiro a Sair";
    default:
      return "";
  }
};

type StrategyProps = {
  tenantId: string;
  stockId: string;
  initialValue: EStockStrategy;
};

export const Strategy: FC<StrategyProps> = ({
  initialValue,
  stockId,
  tenantId,
}) => {
  const [value, setValue] = useState<EStockStrategy>(initialValue);
  const [loading, setLoading] = useState(false); // New loading state

  const toggleStrategy = async () => {
    const newStrategy =
      value === EStockStrategy.Fifo ? EStockStrategy.Lifo : EStockStrategy.Fifo;

    setLoading(true);
    setValue(newStrategy);

    const result = await toggleStockStrategyAction({
      stockId,
      tenantId,
    });

    setLoading(false);

    if (result.isFailure) {
      setValue(value);
      toast.error("Erro ao alterar a estratégia de estoque. Tente novamente.");
    } else {
      toast.success("Estratégia de estoque alterada com sucesso!");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-sm">Estratégia</p>
      <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3">
        <span className="text-sm">{getStockStrategyLabel(value)}</span>
        <button
          onClick={toggleStrategy}
          className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
        >
          <RefreshCcwIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

"use client";

import { FC, useState } from "react";
import { updateProductSalableAction } from "../../_actions/update-product-salable";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SalableProps = {
  productId: string;
  tenantId: string;
  defaultValue: boolean;
  className?: string;
};

export const Salable: FC<SalableProps> = ({
  defaultValue = false,
  productId,
  tenantId,
  className,
}) => {
  const [isSalable, setIsSalable] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSalable = async () => {
    setIsLoading(true);
    try {
      const newValue = !isSalable;
      const result = await updateProductSalableAction({
        value: newValue,
        productId,
        tenantId,
      });

      if ("error" in result) {
        toast.error("Falha na atualização", {
          description: "Não foi possível atualizar o status do produto.",
        });
        return;
      }

      setIsSalable(newValue);
      toast.success("Status atualizado", {
        description: `Este produto agora ${newValue ? " é vendável" : "não é vendável"}.`,
      });
    } catch (error) {
      console.error("Failed to update active status:", error);
      toast.error("Erro inesperado", {
        description: "Ocorreu um erro ao atualizar o status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="font-bold text-sm">É vendável?</p>
      <div className="w-full h-9 border rounded-md bg-secondary px-5 text-sm flex items-center justify-between">
        <span>{isSalable ? "Sim" : "Não"}</span>
        <div className="flex items-center gap-2">
          <Switch
            id="product-active-status"
            checked={isSalable}
            onCheckedChange={toggleSalable}
            disabled={isLoading}
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
};

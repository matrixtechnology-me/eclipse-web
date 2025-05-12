"use client";

import { FC, useState } from "react";
import { updateCustomerActiveAction } from "../../_actions/update-customer-active";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ActiveProps = {
  customerId: string;
  tenantId: string;
  defaultValue: boolean;
  className?: string;
};

export const Active: FC<ActiveProps> = ({
  defaultValue = false,
  customerId,
  tenantId,
  className,
}) => {
  const [isActive, setIsActive] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const toggleActive = async () => {
    setIsLoading(true);
    try {
      const newValue = !isActive;
      const result = await updateCustomerActiveAction({
        value: newValue,
        customerId,
        tenantId,
      });

      if ("error" in result) {
        toast.error("Falha na atualização", {
          description: "Não foi possível atualizar o status do cliente.",
        });
        return;
      }

      setIsActive(newValue);
      toast.success("Status atualizado", {
        description: `Cliente ${
          newValue ? "ativado" : "desativado"
        } com sucesso.`,
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
      <p className="font-bold text-sm">Está ativo?</p>
      <div className="w-full h-9 border rounded-md bg-secondary px-5 text-sm flex items-center justify-between">
        <span>{isActive ? "Sim" : "Não"}</span>
        <div className="flex items-center gap-2">
          <Switch
            id="active-status"
            checked={isActive}
            onCheckedChange={toggleActive}
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

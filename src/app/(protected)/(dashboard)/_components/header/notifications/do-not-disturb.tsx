"use client";

import { useTransition, useState, FC } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateUserTenantDoNotDisturbAction } from "../../../_actions/update-user-tenant-do-not-disturb";

type DoNotDisturbProps = {
  initialValue: boolean;
  userId: string;
  tenantId: string;
};

export const DoNotDisturb: FC<DoNotDisturbProps> = ({
  tenantId,
  userId,
  initialValue = false,
}) => {
  const [checked, setChecked] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const toggleDoNotDisturb = (value: boolean) => {
    setChecked(value);
    startTransition(async () => {
      const result = await updateUserTenantDoNotDisturbAction({
        userId,
        tenantId,
      });

      if (result.isSuccess) {
        toast.success("Preferência atualizada", {
          description: `Modo "Não perturbe" ${
            value ? "ativado" : "desativado"
          }.`,
        });
      } else {
        toast.error("Erro ao atualizar", {
          description: result.error.message ?? "Tente novamente mais tarde.",
        });
        setChecked((prev) => !prev);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="do-not-disturb-switch">Não perturbe</Label>
      <Switch
        id="do-not-disturb-switch"
        checked={checked}
        onCheckedChange={toggleDoNotDisturb}
        disabled={isPending}
      />
    </div>
  );
};

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";
import { cancelPosEventAction } from "../../_actions/cancel-pos-event";
import { EPosEventStatus } from "@prisma/client";

type CancelPosEventProps = {
  posId: string;
  tenantId: string;
  posEventId: string;
  value: EPosEventStatus;
};

export const CancelPosEvent: FC<CancelPosEventProps> = ({
  posEventId,
  posId,
  tenantId,
  value,
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await cancelPosEventAction({
      posEventId,
      posId,
      tenantId,
    });

    if (result.isFailure) {
      return toast("Erro ao cancelar evento", {
        description: "Não foi possível cancelar o evento. Tente novamente.",
      });
    }

    toast("Evento cancelado", {
      description: "O evento foi removido com sucesso.",
    });

    router.push(PATHS.PROTECTED.DASHBOARD.POS.POS(posId).INDEX);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="h-8 bg-transparent border border-red-500 text-red-500 hover:text-primary-foreground hover:bg-red-500"
          disabled={value === EPosEventStatus.Canceled}
        >
          Cancelar evento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar evento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja cancelar este evento? Essa ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
          >
            Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

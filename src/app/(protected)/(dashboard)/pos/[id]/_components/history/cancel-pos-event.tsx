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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";
import { cancelPosEventAction } from "../../_actions/cancel-pos-event";
import { EPosEventStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={value === EPosEventStatus.Canceled}
        >
          <Trash2 className="size-4" />
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
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

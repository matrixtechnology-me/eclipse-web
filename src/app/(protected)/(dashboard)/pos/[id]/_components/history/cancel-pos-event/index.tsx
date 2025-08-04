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
import { EPosEventStatus, EPosEventType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Action } from "@/lib/action";
import { cancelPosSaleAction } from "../../../_actions/cancel-pos-sale";

type CancelPosEventProps = {
  eventType: EPosEventType;
  posId: string;
  tenantId: string;
  posEventId: string;
  value: EPosEventStatus;
};

const cancelActionMap: Record<
  EPosEventType,
  Action<{
    tenantId: string;
    posId: string;
    posEventId: string;
  }> | null
> = {
  Entry: null,
  Output: null,
  Sale: cancelPosSaleAction,
  Payment: null,
  Return: null,
  Exchange: null,
};

export const CancelPosEvent: FC<CancelPosEventProps> = ({
  eventType,
  posEventId,
  posId,
  tenantId,
  value,
}) => {
  const router = useRouter();
  const cancelEventAction = cancelActionMap[eventType];

  const handleDelete = async () => {
    if (!cancelEventAction) {
      console.log(`Unmapped cancel action for event type ${eventType}.`);

      return toast("Funcionalidade indisponível", {
        description: "Esse recurso está em desenvolvimento e será adicionado em breve.",
      });
    }

    const result = await cancelEventAction({
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
        {!cancelEventAction ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Recurso indisponível</AlertDialogTitle>
              <AlertDialogDescription>
                Esse recurso está em desenvolvimento e será adicionado em breve.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar evento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja cancelar este evento? Essa ação não pode ser desfeita.
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

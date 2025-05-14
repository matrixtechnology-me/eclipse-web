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
import { deletePosAction } from "../_actions/delete-pos";
import { PATHS } from "@/config/paths";

type DeletePosProps = {
  posId: string;
  tenantId: string;
};

export const DeletePos: FC<DeletePosProps> = ({ posId, tenantId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deletePosAction({
      posId,
      tenantId,
    });

    if (result.isFailure) {
      return toast("Erro ao deletar PDV", {
        description: "Não foi possível deletar o PDV. Tente novamente.",
      });
    }

    toast("PDV deletado", {
      description: "O ponto de venda foi removido com sucesso.",
    });

    router.push(PATHS.PROTECTED.DASHBOARD.POS.INDEX());
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deletar PDV</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar PDV</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja deletar este ponto de venda? Essa ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

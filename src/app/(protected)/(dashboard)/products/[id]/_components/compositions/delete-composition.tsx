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
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProductCompositionAction } from "../../_actions/delete-product-composition";

type DeleteCompositionProps = {
  compositionId: string;
  tenantId: string;
  productId: string;
};

export const DeleteComposition: FC<DeleteCompositionProps> = ({
  compositionId,
  productId,
  tenantId,
}) => {
  const handleDelete = async () => {
    const result = await deleteProductCompositionAction({
      compositionId,
      productId,
      tenantId,
    });

    if (result.isFailure) {
      return toast("Erro ao deletar composição", {
        description: "Não foi possível deletar a composição. Tente novamente.",
      });
    }

    toast("Composição deletada", {
      description: "A composição foi removida com sucesso.",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Composição</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja deletar esta composição? Essa ação não
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

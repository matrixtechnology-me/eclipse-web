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
import { deleteProductSpecificationAction } from "../../_actions/delete-product-specification";

type DeleteSpecificationProps = {
  specificationId: string;
  tenantId: string;
  productId: string;
};

export const DeleteSpecification: FC<DeleteSpecificationProps> = ({
  specificationId,
  productId,
  tenantId,
}) => {
  const handleDelete = async () => {
    const result = await deleteProductSpecificationAction({
      specificationId,
      productId,
      tenantId,
    });

    if (result.isFailure) {
      return toast("Erro ao deletar especificação", {
        description:
          "Não foi possível deletar a especificação. Tente novamente.",
      });
    }

    toast("Especificação deletada", {
      description: "A especificação foi removida com sucesso.",
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
          <AlertDialogTitle>Deletar Especificação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja deletar esta especificação? Essa ação não
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

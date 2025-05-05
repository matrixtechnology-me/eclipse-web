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
import { deleteProductAction } from "../../_actions/delete-product";
import { PATHS } from "@/config/paths";

type DeleteProductProps = {
  productId: string;
  tenantId: string;
};

export const DeleteProduct: FC<DeleteProductProps> = ({
  productId,
  tenantId,
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteProductAction({
      productId,
      tenantId,
    });

    if (result.isFailure) {
      return toast("Erro ao deletar produto", {
        description: "Não foi possível deletar o produto. Tente novamente.",
      });
    }

    toast("Produto deletado", {
      description: "O produto foi removido com sucesso.",
    });

    router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX());
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deletar Produto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Produto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja deletar este produto? Essa ação não pode
            ser desfeita.
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

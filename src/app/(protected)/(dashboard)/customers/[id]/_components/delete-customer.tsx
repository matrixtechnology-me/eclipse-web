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
import { deleteCustomerAction } from "../_actions/delete-customer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { PATHS } from "@/config/paths";
import { toast } from "sonner";

type DeleteCustomerProps = {
  customerId: string;
  tenantId: string;
};

export const DeleteCustomer: FC<DeleteCustomerProps> = ({
  customerId,
  tenantId,
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteCustomerAction({ customerId, tenantId });

    if ("error" in result) {
      return toast("Falha ao deletar cliente", {
        description:
          "Ocorreu um erro ao tentar deletar o cliente. Por favor, tente novamente.",
      });
    }

    toast("Cliente deletado com sucesso", {
      description: "O cliente foi removido da sua lista com sucesso.",
    });

    router.push(PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX());
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
          <AlertDialogTitle>Deletar Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja deletar este cliente? Esta ação não poderá
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

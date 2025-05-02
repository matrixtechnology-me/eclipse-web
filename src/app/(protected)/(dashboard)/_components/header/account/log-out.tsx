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
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export const LogOut = () => {
  const router = useRouter();

  const handleSignOut = () => {
    destroyCookie(null, "X-Identity", { path: "/" });
    router.push(PATHS.PUBLIC.AUTH.SIGN_IN);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-2"
        >
          <LogOutIcon className="size-4 text-red-500" />
          <span className="text-red-500">Sair</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Sair da Aplicação</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja realmente sair da aplicação?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSignOut}
          >
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

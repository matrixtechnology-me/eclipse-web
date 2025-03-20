"use client";

import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    destroyCookie(null, "X-Identity", { path: "/" });
    router.push(PATHS.PUBLIC.AUTH.SIGN_IN);
  };

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      <LogOutIcon className="size-4" />
      Sair
    </Button>
  );
};

"use client";

import { PATHS } from "@/config/paths";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    destroyCookie(null, "X-Identity", { path: "/" });
    router.push(PATHS.PUBLIC.AUTH.SIGN_IN);
  };

  return <button onClick={handleSignOut}>Sair</button>;
};

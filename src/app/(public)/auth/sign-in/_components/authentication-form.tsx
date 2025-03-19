"use client";

import { useRouter } from "next/navigation";
import { authenticateUserAction } from "../_actions/authenticate-user";
import { PATHS } from "@/config/paths";
import { setCookie } from "nookies";

export const AuthenticationForm = () => {
  const router = useRouter();

  const handleAuthenticate = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) return;

    const result = await authenticateUserAction({
      email,
      password,
    });

    if ("error" in result) {
      return alert("Não foi possível efetuar o login");
    }

    const { sessionId } = result.data;

    setCookie(null, "X-Identity", sessionId, { path: "/" });

    router.push(PATHS.PROTECTED.HOMEPAGE);
  };

  return (
    <form action={handleAuthenticate}>
      <div>
        <label htmlFor="email">E-mail</label>
        <input type="text" name="email" placeholder="Insira o e-mail" />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input type="password" name="password" placeholder="Insira a senha" />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
};

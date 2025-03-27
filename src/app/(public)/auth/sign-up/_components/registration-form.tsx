"use client";

import { useRouter } from "next/navigation";
import { registerUserAction } from "../_actions/register-user";
import { PATHS } from "@/config/paths";
import { setCookie } from "nookies";

export const RegistrationForm = () => {
  const router = useRouter();

  const handleRegister = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password || !name) return;

    const result = await registerUserAction({
      email,
      name,
      password,
    });

    if ("error" in result) {
      return alert("Não foi possível efetuar o login");
    }

    const { sessionId } = result.data;

    setCookie(null, "X-Identity", sessionId, { path: "/" });

    return router.push(PATHS.PROTECTED.GET_STARTED);
  };

  return (
    <form action={handleRegister}>
      <div>
        <label htmlFor="name">Nome</label>
        <input type="text" name="name" placeholder="Insira o seu nome" />
      </div>
      <div>
        <label htmlFor="email">E-mail</label>
        <input type="text" name="email" placeholder="Insira o e-mail" />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input type="text" name="password" placeholder="Insira a senha" />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

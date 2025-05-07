"use client";

import { useRouter } from "next/navigation";
import { authenticateUserAction } from "../_actions/authenticate-user";
import { PATHS } from "@/config/paths";
import { setCookie } from "nookies";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserTenants } from "../_actions/get-user-tenants";
import { PasswordInput } from "./password-input";
import { toast } from "sonner";
import { CircleHelpIcon, CircleSlash, UserIcon } from "lucide-react";
import { InvalidCredentialsError, NotFoundError } from "@/errors";
import { COOKIE_KEYS } from "@/config/cookie-keys";
import { JwtService } from "@/services/jwt.service";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "E-mail é obrigatório.",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export const AuthenticationForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async ({ email, password }: FormSchema) => {
    const authenticateUserResult = await authenticateUserAction({
      email,
      password,
    });

    if (authenticateUserResult.isFailure) {
      switch (authenticateUserResult.error.name) {
        case NotFoundError.name:
          return toast("Usuário não encontrado", {
            description: "Verifique o e-mail informado e tente novamente",
            icon: <UserIcon className="size-4" />,
          });
        case InvalidCredentialsError.name:
          return toast("Credenciais inválidas", {
            description: "E-mail ou senha incorretos. Tente novamente",
            icon: <CircleSlash className="size-4" />,
          });
        default:
          return toast("Erro inesperado", {
            description:
              "Ocorreu um erro ao fazer login. Tente novamente mais tarde",
            icon: <CircleHelpIcon className="size-4" />,
          });
      }
    }

    const { accessToken, refreshToken, userId } = authenticateUserResult.value;

    setCookie(null, COOKIE_KEYS.AUTHENTICATION.TOKENS.ACCESS, accessToken, {
      path: "/",
    });
    setCookie(null, COOKIE_KEYS.AUTHENTICATION.TOKENS.REFRESH, refreshToken, {
      path: "/",
    });

    const getUserTenantsResult = await getUserTenants({ userId });

    if (getUserTenantsResult.isFailure) {
      if (getUserTenantsResult.error.name === NotFoundError.name) {
        return router.push(PATHS.PROTECTED.GET_STARTED);
      } else {
        return alert("Aconteceu um erro ao buscar as empresas");
      }
    }

    const { tenants } = getUserTenantsResult.value;

    const targetTenant = tenants[0];

    setCookie(null, COOKIE_KEYS.AUTHENTICATION.TENANT, targetTenant.id, {
      path: "/",
    });

    router.push(PATHS.PROTECTED.DASHBOARD.HOMEPAGE);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
        {/* E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Seu endereço de e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password */}
        <PasswordInput form={form} name="password" label="Sua senha segura" />
        <div className="flex items-center justify-between">
          <div />
          <span className="text-sm text-muted-foreground">
            Esqueceu a senha?
          </span>
        </div>
        <Button type="submit" className="w-full h-10">
          Entrar
        </Button>
      </form>
    </Form>
  );
};

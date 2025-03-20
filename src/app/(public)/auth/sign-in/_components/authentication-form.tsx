"use client";

import { useRouter } from "next/navigation";
import { authenticateUserAction } from "../_actions/authenticate-user";
import { PATHS } from "@/config/paths";
import { setCookie } from "nookies";
import {
  Form,
  FormControl,
  FormDescription,
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
  });

  const handleSubmit = async ({ email, password }: FormSchema) => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full max-w-sm"
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Sua senha segura"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-10">
          Entrar
        </Button>
      </form>
    </Form>
  );
};

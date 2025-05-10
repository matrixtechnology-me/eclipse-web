"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authenticateUserAction } from "../_actions/authenticate-user";
import { PasswordInput } from "./password-input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-mail é obrigatório." })
    .email({ message: "E-mail inválido." }),

  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula.",
    })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve conter pelo menos um caractere especial.",
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
    const result = await authenticateUserAction({
      email,
      password,
    });

    if (result.isFailure) {
      const metadata = result.metadata;

      return toast(metadata?.attributes.title, {
        description: metadata?.attributes.description,
        icon: metadata?.attributes.icon,
      });
    }

    const { href } = result.value;

    router.push(href);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
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
        <PasswordInput form={form} name="password" label="Sua senha segura" />
        <div className="flex items-center justify-between">
          <div />
          <span className="text-sm text-muted-foreground">
            Esqueceu a senha?
          </span>
        </div>
        <Button
          type="submit"
          className="w-full h-10"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Entrar
        </Button>
      </form>
    </Form>
  );
};

"use client";

import { useRouter } from "next/navigation";
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
import { PasswordInput } from "./password-input";
import { toast } from "sonner";
import {
  AlertTriangleIcon,
  CircleHelpIcon,
  CircleSlash,
  UserIcon,
} from "lucide-react";
import { InvalidCredentialsError, NotFoundError } from "@/errors";
import { registerUserAction } from "../_actions/register-user";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nome é obrigatório." })
      .min(3, { message: "Nome deve ter pelo menos 3 caracteres." })
      .max(100, { message: "Nome não pode exceder 100 caracteres." })
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
        message: "Nome deve conter apenas letras e espaços.",
      }),

    email: z
      .string()
      .min(1, { message: "E-mail é obrigatório." })
      .email({ message: "Por favor, insira um e-mail válido." })
      .max(100, { message: "E-mail não pode exceder 100 caracteres." }),

    password: z
      .string()
      .min(1, { message: "Senha é obrigatória." })
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres." })
      .max(50, { message: "Senha não pode exceder 50 caracteres." })
      .regex(/[A-Z]/, {
        message: "Senha deve conter pelo menos uma letra maiúscula.",
      })
      .regex(/[a-z]/, {
        message: "Senha deve conter pelo menos uma letra minúscula.",
      })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Senha deve conter pelo menos um caractere especial.",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export const RegistrationForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const handleSubmit = async ({
    email,
    password,
    name,
  }: Omit<FormSchema, "confirmPassword">) => {
    try {
      const result = await registerUserAction({
        email,
        password,
        name,
      });

      if (!result.isSuccess) {
        if (result.error instanceof NotFoundError) {
          return toast("Usuário não encontrado", {
            description: "Verifique o e-mail informado e tente novamente",
            icon: <UserIcon className="size-4" />,
          });
        }

        if (result.error instanceof InvalidCredentialsError) {
          return toast("Credenciais inválidas", {
            description:
              result.error.message ||
              "E-mail ou senha incorretos. Tente novamente",
            icon: <CircleSlash className="size-4" />,
          });
        }

        return toast("Erro inesperado", {
          description:
            "Ocorreu um erro ao registrar. Tente novamente mais tarde",
          icon: <CircleHelpIcon className="size-4" />,
        });
      }

      const { sessionId } = result.value!;

      setCookie(null, "X-Identity", sessionId, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      router.push(PATHS.PROTECTED.GET_STARTED);
    } catch (error) {
      console.error("Registration error:", error);
      return toast("Erro no sistema", {
        description: "Falha ao processar o registro. Contate o suporte",
        icon: <AlertTriangleIcon className="size-4" />,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Seu endereço de e-mail"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Seu endereço de e-mail"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password */}
        <PasswordInput form={form} name="password" label="Senha" />
        {/* Confirm Password */}
        <PasswordInput<FormSchema>
          form={form}
          name="confirmPassword"
          label="Confirmar senha"
        />
        <Button
          type="submit"
          className="w-full h-10"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Cadastrando..." : "Cadastre-se"}
        </Button>
      </form>
    </Form>
  );
};

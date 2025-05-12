"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setNewPasswordAction } from "../_actions/set-new-password";
import { PasswordInput } from "./password-input";

const formSchema = z
  .object({
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

type FormSchema = z.infer<typeof formSchema>;

export const FirstAccessForm = () => {
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: FormSchema) => {
    const result = await setNewPasswordAction({
      password: data.password,
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
        <PasswordInput form={form} name="password" label="Nova senha" />
        <PasswordInput
          form={form}
          name="confirmPassword"
          label="Confirmar senha"
        />
        <Button
          type="submit"
          className="w-full h-10"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Definir senha
        </Button>
      </form>
    </Form>
  );
};

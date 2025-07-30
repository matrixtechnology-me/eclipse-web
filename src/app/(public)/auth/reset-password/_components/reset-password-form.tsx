"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PATHS } from "@/config/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordAction } from "../_actions/reset-password";
import { PasswordInput } from "./password-input";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

type FormSchema = z.infer<typeof formSchema>;

export const ResetPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async ({ password }: FormSchema) => {
    setLoading(true);

    const result = await resetPasswordAction({
      password,
    });

    if (result.isFailure) {
      const metadata = result.metadata;

      setLoading(false);

      return toast(metadata?.attributes.title, {
        description: metadata?.attributes.description,
        icon: metadata?.attributes.icon,
      });
    }

    router.push(PATHS.PUBLIC.AUTH.SIGN_IN);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
        <PasswordInput form={form} name="password" label="Sua senha segura" />
        <PasswordInput
          form={form}
          name="confirmPassword"
          label="Confirme sua senha"
        />
        <Button
          type="submit"
          className="w-full h-10"
          disabled={form.formState.isSubmitting || loading}
        >
          {form.formState.isSubmitting || loading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            "Continuar"
          )}
        </Button>
      </form>
    </Form>
  );
};

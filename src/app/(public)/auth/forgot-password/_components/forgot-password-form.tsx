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
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordAction } from "../_actions/forgot-password";
import { toast } from "sonner";
import { PATHS } from "@/config/paths";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-mail é obrigatório." })
    .email({ message: "E-mail inválido." }),
});

type FormSchema = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async ({ email }: FormSchema) => {
    setLoading(true);

    const result = await forgotPasswordAction({
      email,
    });

    if (result.isFailure) {
      const metadata = result.metadata;

      console.log(result);

      setLoading(false);

      return toast(metadata?.attributes.title, {
        description: metadata?.attributes.description,
        icon: metadata?.attributes.icon,
      });
    }

    const metadata = result.metadata;

    toast(metadata?.attributes.title, {
      description: metadata?.attributes.description,
      icon: metadata?.attributes.icon,
    });

    router.push(PATHS.PUBLIC.AUTH.VERIFY_CODE());
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

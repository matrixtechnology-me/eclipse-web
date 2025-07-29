"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PATHS } from "@/config/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { verifyCodeAction } from "../_actions/verify-code";

const formSchema = z.object({
  verificationCodeValue: z
    .string()
    .min(6, { message: "Codigo de verificação é obrigatório." }),
});

type FormSchema = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationCodeValue: "",
    },
  });

  const handleSubmit = async ({ verificationCodeValue }: FormSchema) => {
    setLoading(true);

    const result = await verifyCodeAction({
      verificationCodeValue,
    });

    if (result.isFailure) {
      const metadata = result.metadata;

      setLoading(false);

      return toast(metadata?.attributes.title, {
        description: metadata?.attributes.description,
        icon: metadata?.attributes.icon,
      });
    }

    const { metadata, value } = result;

    toast(metadata?.attributes.title, {
      description: metadata?.attributes.description,
      icon: metadata?.attributes.icon,
    });

    router.push(PATHS.PUBLIC.AUTH.RESET_PASSWORD());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
        <FormField
          control={form.control}
          name="verificationCodeValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Insira o código de verificação enviado para o seu e-mail.
              </FormDescription>
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

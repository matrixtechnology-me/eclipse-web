"use client";

import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";
import { createTenant } from "../_actions/create-tenant";
import { setCookie } from "nookies";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nome é obrigatório." })
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "Nome não pode exceder 100 caracteres." }),
  description: z
    .string()
    .max(255, { message: "Descrição não pode exceder 255 caracteres." })
    .optional()
    .default(""),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateTenantForm = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Sessão não encontrada");
    }

    const result = await createTenant({
      ...values,
      userId: session.id,
    });

    if (result.isFailure) {
      throw new Error("Erro ao criar tenant");
    }

    const { tenantId } = result.value;

    setCookie(null, "X-Tenant", result.value.tenantId, { path: "/" });
    router.push(PATHS.PROTECTED.DASHBOARD.HOMEPAGE);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full max-w-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da organização *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome da sua organização"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descrição sobre sua organização (opcional)"
                  className="min-h-36"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-10"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Criando..." : "Criar organização"}
        </Button>
      </form>
    </Form>
  );
};

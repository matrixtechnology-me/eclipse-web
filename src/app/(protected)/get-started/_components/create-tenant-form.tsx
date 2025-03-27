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
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";
import { createTenant } from "../_actions/create-tenant";
import { setCookie } from "nookies";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório.",
  }),
  description: z.string().optional().default(""),
});

type FormSchema = z.infer<typeof formSchema>;

export const CreateTenantForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async ({ description, name }: FormSchema) => {
    const session = await getServerSession();

    if (!session) throw new Error("session not found");

    const result = await createTenant({
      description,
      name,
      userId: session.id,
    });

    if ("error" in result) throw new Error("cannot create a new tenant");

    const { tenantId } = result.data;

    setCookie(null, "X-Tenant", tenantId, { path: "/" });

    router.push(PATHS.PROTECTED.HOMEPAGE);
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
                <Input placeholder="Nome do seu negócio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Descrição da sua empresa"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-10">
          Continuar
        </Button>
      </form>
    </Form>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useRouter } from "next/navigation";
import { createCustomer } from "../_actions/create-customer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { PatternFormat } from "react-number-format";
import { getServerSession } from "@/lib/session";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });

  const handleSubmit = async ({ name, phoneNumber }: FormSchema) => {
    const session = await getServerSession({ requirements: { tenant: true } });

    if (!session) throw new Error("session not found");

    await createCustomer({
      name,
      phoneNumber,
      tenantId: session.tenantId,
    });

    router.push(PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX());
  };

  const handleReset = () => {
    form.reset({
      name: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Clientes</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX()}
                >
                  Clientes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Cliente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome <span className="text-primary font-bold">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Marcos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phone number */}
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field: { ...rest } }) => (
              <div className="space-y-2">
                <FormItem className="w-full">
                  <FormLabel>
                    Número de telefone{" "}
                    <span className="text-primary font-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      placeholder="Número de telefone do usuário"
                      format="(##) #####-####"
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={handleReset}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;

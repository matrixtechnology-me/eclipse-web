"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { createProduct } from "../_actions/create-product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { getServerSession } from "@/lib/session";
import { Variations } from "./_components/variations";
import {
  CreateProductSchema,
  createProductSchema,
} from "./_utils/validations/create-product";

const Page = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      variations: [{ costPrice: 0, salePrice: 0, specifications: [] }],
    },
  });

  const onSubmit = async ({
    description,
    name,
    variations,
  }: CreateProductSchema) => {
    const session = await getServerSession();

    if (!session) throw new Error("session not found");

    const result = await createProduct({
      description,
      name,
      variations,
      tenantId: session.tenantId,
    });

    if ("error" in result) {
      return alert("Não foi possível criar o produto");
    }

    router.push(PATHS.PROTECTED.PRODUCTS.INDEX);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Produtos</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.PRODUCTS.INDEX}>
                  Produtos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Produto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.error(errors)
          )}
          className="space-y-8"
        >
          <div className="flex flex-col gap-3">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>
                    Descrição <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Variations form={form} />
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" type="button" className="h-10">
              Cancelar
            </Button>
            <Button type="submit" className="h-10">
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;

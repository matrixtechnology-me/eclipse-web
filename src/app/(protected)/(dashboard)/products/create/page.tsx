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
import {
  CreateProductSchema,
  createProductSchema,
} from "./_utils/validations/create-product";
import { Specifications } from "./_components/specifications";
import { PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { BarcodeInput } from "./_components/barcode-input";
import { CurrencyInput } from "./_components/currency-input";

const Page = () => {
  const router = useRouter();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      barCode: "",
      costPrice: 0,
      salePrice: 0,
      specifications: [],
    },
  });

  const onSubmit = async (values: CreateProductSchema) => {
    try {
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      const result = await createProduct({
        ...values,
        tenantId: session.tenantId,
      });

      if (result.isFailure) {
        return;
      }

      toast.success("Produto criado com sucesso");
      router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX());
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o produto"
      );
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <PackagePlus className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Novo Produto</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX()}
                >
                  Produtos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Barras</FormLabel>
                  <FormControl>
                    <BarcodeInput
                      placeholder="Digite o código de barras"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Custo*</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="R$ 0,00"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda*</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="R$ 0,00"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Specifications form={form} />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX())
              }
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Salvando..."
                : "Cadastrar Produto"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;

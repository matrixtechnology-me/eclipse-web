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

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  costPrice: z.string().transform((raw) => Number(raw)),
  salePrice: z.string().transform((raw) => Number(raw)),
  quantity: z.string().transform((raw) => Number(raw)),
});
type FormSchema = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      costPrice: 0,
      salePrice: 0,
      quantity: 0,
    },
  });

  const handleSubmit = async ({
    costPrice,
    description,
    salePrice,
    name,
    quantity,
  }: FormSchema) => {
    await createProduct({
      costPrice,
      description,
      salePrice,
      name,
      quantity,
    });

    router.push(PATHS.PROTECTED.PRODUCTS.INDEX);
  };

  return (
    <div className="flex flex-col gap-5">
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-5">
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
                    <Input placeholder="Ex.: Marcos" {...field} />
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
                    <Input placeholder="Ex.: Marcos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Cost price */}
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preço de custo <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: R$29,90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Sale price */}
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de venda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: R$99,90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

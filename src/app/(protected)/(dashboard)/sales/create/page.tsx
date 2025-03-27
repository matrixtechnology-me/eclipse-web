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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import {
  CreateSaleSchema,
  createSaleSchema,
} from "./_utils/validations/create-sale";
import { Products } from "./_components/products";
import { getCustomers } from "../_actions/get-customers";
import { useCallback } from "react";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import { createSale } from "../_actions/create-sale";

const Page = () => {
  const router = useRouter();

  const form = useForm<CreateSaleSchema>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: {
      customerId: "",
      products: [],
    },
  });

  const handleSubmit = async ({ customerId, products }: CreateSaleSchema) => {
    await createSale({
      customerId,
      products: products.map((product) => ({
        id: product.id,
        quantity: +product.quantity,
      })),
    });

    router.push(PATHS.PROTECTED.SALES.INDEX);
  };

  const loadCustomers: LoadOptions<
    DefaultOptionType<string>,
    GroupBase<DefaultOptionType<string>>,
    { page: number; itemsPerPage: number }
  > = useCallback(async (input, _prevOptions, additional) => {
    if (input.trim().length < 3 && input.trim().length > 0) {
      form.setError("customerId", { message: "mínimo de 3 caracteres." });
      return { options: [], additional, hasMore: true };
    }

    const curPage = additional!.page;
    const pageSize = additional!.itemsPerPage;

    const response = await getCustomers({
      searchValue: input.trim(),
      limit: pageSize,
      page: curPage,
      active: true,
    });

    if (!response.data) {
      console.log("error fetching customers");
      return { options: [], additional, hasMore: true };
    }

    return {
      options: response.data.results.map((customer) => ({
        value: customer.id,
        label: customer.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < response.data.pagination.totalItems,
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Vendas</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.CUSTOMERS.INDEX()}>
                  Vendas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo venda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <SelectPaginated<string>
                    className="text-sm"
                    placeholder="Buscar por um cliente..."
                    menuPlacement="bottom"
                    name={field.name}
                    loadOptions={loadCustomers}
                    debounceTimeout={1000}
                    onInputChange={() => form.clearErrors("customerId")}
                    onChange={(option) => field.onChange(option!.value)}
                    additional={{
                      page: 1,
                      itemsPerPage: 10,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Products form={form} />
          <Button type="submit">Adicionar</Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;

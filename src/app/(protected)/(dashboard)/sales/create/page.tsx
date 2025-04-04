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
import { useCallback, useState } from "react";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { createSale } from "../_actions/create-sale";
import { getServerSession } from "@/lib/session";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateSaleSchema>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: {
      customerId: "",
      products: [],
    },
  });

  const onSubmit = async (values: CreateSaleSchema) => {
    try {
      setIsSubmitting(true);

      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      const result = await createSale({
        customerId: values.customerId,
        tenantId: session.tenantId,
        products: values.products.map((product) => ({
          id: product.id,
          totalQty: Number(product.quantity),
        })),
      });

      if (result.isFailure) {
        return;
      }

      toast.success("Venda registrada com sucesso");
      router.push(PATHS.PROTECTED.SALES.INDEX);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao registrar venda"
      );
    } finally {
      setIsSubmitting(false);
    }
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

    if (response.isFailure) {
      console.log("error fetching customers");
      return { options: [], additional, hasMore: true };
    }

    return {
      options: response.value.results.map((customer) => ({
        value: customer.id,
        label: customer.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < response.value.pagination.totalItems,
    };
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Nova Venda</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.SALES.INDEX}>
                  Vendas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Nova</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente*</FormLabel>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(PATHS.PROTECTED.SALES.INDEX)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Finalizar Venda"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;

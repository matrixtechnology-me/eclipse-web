"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import {
  createSaleSchema,
  CreateSaleSchema,
} from "./_utils/validations/create-sale";
import { getServerSession } from "@/lib/session";
import { toast } from "sonner";
import { PATHS } from "@/config/paths";
import { LoadOptions } from "react-select-async-paginate";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { GroupBase } from "react-select";
import { getCustomers } from "../../_actions/get-customers";
import { Products } from "./_components/products";
import { ReceivingMethods } from "./_components/receiving-methods";
import { createPosSaleAction } from "../../_actions/create-pos-sale";

type AddSaleProps = {
  posId: string;
};

export const AddSale: FC<AddSaleProps> = ({ posId }) => {
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

      const result = await createPosSaleAction({
        description: "",
        customerId: values.customerId,
        posId,
        products: values.products.map((product) => ({
          id: product.id,
          totalQty: Number(product.quantity),
        })),
      });

      if (result.isFailure) {
        return;
      }

      toast.success("Venda registrada com sucesso");
      router.push(PATHS.PROTECTED.DASHBOARD.SALES.INDEX);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nova venda</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar venda</DialogTitle>
          <DialogDescription>
            Faça alterações e clique em "Salvar" quando terminar.
          </DialogDescription>
        </DialogHeader>
        {/* Content */}
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

            <ReceivingMethods form={form} />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(PATHS.PROTECTED.DASHBOARD.SALES.INDEX)
                }
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Finalizar Venda"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

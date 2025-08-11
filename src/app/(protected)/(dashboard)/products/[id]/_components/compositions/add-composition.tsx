"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormMessage } from "@/components/ui/form";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericFormat } from "react-number-format";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import { toast } from "sonner";
import { createProductCompositionAction } from "../../_actions/create-product-composition";
import { ProductListItem } from "@/domain/services/product/product-service";
import { getProductsAction } from "../../../_actions/get-products";

const formSchema = z.object({
  childId: z.string().min(1, "Campo obrigatório"),
  totalQty: z.number().min(1, "Campo obrigatório"),
});

type AddCompositionProps = {
  productId: string;
  tenantId: string;
};

export const AddComposition = ({
  productId,
  tenantId,
}: AddCompositionProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childId: "",
      totalQty: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createProductCompositionAction({
      childId: values.childId,
      totalQty: values.totalQty,
      parentId: productId,
      tenantId,
    });

    if (result.isFailure) {
      return toast.error("Erro ao adicionar especificação", {
        description: "Não foi possível criar uma nova especificação.",
      });
    }

    toast.success("Especificação adicionada");
    setOpen(false);
    form.reset();
  };

  const onErrors = (errors: Record<string, { message?: string }>) => {
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(`${error.message}`);
      }
    });
  };

  const loadPaginatedSearchProducts: LoadOptions<
    DefaultOptionType<ProductListItem>,
    GroupBase<DefaultOptionType<ProductListItem>>,
    { page: number; itemsPerPage: number }
  > = async (input, _prevOptions, additional) => {
    if (input.trim().length < 3 && input.trim().length > 0) {
      form.setError("childId", { message: "mínimo de 3 caracteres." });
      return { options: [], additional, hasMore: true };
    }

    const curPage = additional!.page;
    const pageSize = additional!.itemsPerPage;

    const result = await getProductsAction({
      query: input.trim(),
      active: true,
      salable: undefined,
      limit: pageSize,
      page: curPage,
      tenantId,
      excludeIds: [productId],
    });

    if (result.isFailure) {
      toast.error("Erro ao buscar os produtos. Tente novamente.");
      return { options: [], additional, hasMore: true };
    }

    const { products, pagination } = result.value;

    if (products.length === 0) {
      toast.info("Nenhum produto encontrado.");
    }

    return {
      options: products.map((product) => ({
        value: product,
        label: product.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < pagination.totalCount,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          Nova composição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar produto</DialogTitle>
          <DialogDescription>
            Selecione um produto e informe a quantidade
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Produto*</Label>
              <Controller
                control={form.control}
                name="childId"
                render={({ field }) => (
                  <SelectPaginated<ProductListItem>
                    className="text-sm"
                    placeholder="Buscar um produto..."
                    menuPlacement="bottom"
                    loadOptions={loadPaginatedSearchProducts}
                    debounceTimeout={1000}
                    onInputChange={() => form.clearErrors("childId")}
                    onChange={(option) => {
                      const product = option!.value;
                      field.onChange(product.id);
                    }}
                    additional={{
                      page: 1,
                      itemsPerPage: 10,
                    }}
                  />
                )}
              />
              <FormMessage>
                {form.formState.errors.childId?.message}
              </FormMessage>
            </div>

            <div className="space-y-2">
              <Label>Quantidade*</Label>
              <Controller
                control={form.control}
                name="totalQty"
                render={({ field }) => (
                  <NumericFormat
                    customInput={Input}
                    placeholder="Quantidade"
                    value={field.value}
                    onValueChange={(values) => {
                      const parsedValue = Number(values.value);
                      field.onChange(parsedValue);
                    }}
                    allowNegative={false}
                  />
                )}
              />
              <FormMessage>
                {form.formState.errors.totalQty?.message}
              </FormMessage>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit, onErrors)}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Adicionando..."
              : "Adicionar produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

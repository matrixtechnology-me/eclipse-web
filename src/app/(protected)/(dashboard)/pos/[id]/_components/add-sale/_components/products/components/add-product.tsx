"use client";

import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, UseFieldArrayAppend, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import { z } from "zod";
import { getProducts, Product } from "../../../../../_actions/get-products";
import {
  CreateSaleSchema,
  productSchema,
} from "../../../_utils/validations/create-sale";
import { toast } from "sonner";

interface IProps {
  tenantId: string;
  appendProduct: UseFieldArrayAppend<CreateSaleSchema, "products">;
}

type OrderItemFormType = z.infer<typeof productSchema>;

const formDefaultValues: OrderItemFormType = {
  id: "",
  name: "",
  costPrice: 0,
  salePrice: 0,
  quantity: "1",
};

export const AddProduct = ({ appendProduct, tenantId }: IProps) => {
  const [open, setOpen] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState<number | null>(null);

  const form = useForm<OrderItemFormType>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(productSchema),
  });

  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData) => {
        const qty = Number(formData.quantity);
        if (maxQuantity !== null && qty > maxQuantity) {
          toast.error(`Quantidade máxima disponível: ${maxQuantity}`);
          return;
        }

        appendProduct(formData);
        setOpen(false);
        form.reset(formDefaultValues);
        setMaxQuantity(null);
      },
      (errors) => console.log(errors)
    );
    submissionFn();
  };

  const onErrors = (errors: Record<string, { message?: string }>) => {
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(`${error.message}`);
      }
    });
  };

  const loadPaginatedSearchProducts: LoadOptions<
    DefaultOptionType<Product>,
    GroupBase<DefaultOptionType<Product>>,
    { page: number; itemsPerPage: number }
  > = async (input, _prevOptions, additional) => {
    if (input.trim().length < 3 && input.trim().length > 0) {
      form.setError("id", { message: "mínimo de 3 caracteres." });
      return { options: [], additional, hasMore: true };
    }

    const curPage = additional!.page;
    const pageSize = additional!.itemsPerPage;

    const result = await getProducts({
      searchValue: input.trim(),
      active: true,
      limit: pageSize,
      page: curPage,
      tenantId,
    });

    if (result.isFailure) {
      toast.error("Erro ao buscar os produtos. Tente novamente.");
      return { options: [], additional, hasMore: true };
    }

    const products = result.value.results;

    if (products.length === 0) {
      toast.info("Nenhum produto encontrado.");
    }

    return {
      options: products.map((product) => ({
        value: product,
        label: product.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < result.value.pagination.totalItems,
    };
  };

  const { quantity, salePrice } = form.watch();

  const subTotal = useMemo(
    () => salePrice * Number(quantity),
    [quantity, salePrice]
  );

  useEffect(() => {
    if (subTotal === undefined || salePrice <= 0) return;
  }, [subTotal, quantity, salePrice]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar produto
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
                name="id"
                render={({ field }) => (
                  <SelectPaginated<Product>
                    className="text-sm"
                    placeholder="Buscar um produto..."
                    menuPlacement="bottom"
                    loadOptions={loadPaginatedSearchProducts}
                    debounceTimeout={1000}
                    onInputChange={() => form.clearErrors("id")}
                    onChange={(option) => {
                      const product = option!.value;
                      field.onChange(product.id);
                      form.setValue("name", option!.label);
                      form.setValue("salePrice", product.salePrice);
                      form.setValue("costPrice", product.costPrice);
                      setMaxQuantity(product.availableQty);
                    }}
                    additional={{
                      page: 1,
                      itemsPerPage: 10,
                    }}
                  />
                )}
              />
              <FormMessage>{form.formState.errors.id?.message}</FormMessage>
            </div>

            <div className="space-y-2">
              <Label>Quantidade*</Label>
              <Controller
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <NumericFormat
                    customInput={Input}
                    placeholder="Quantidade"
                    value={field.value}
                    onValueChange={(values) => {
                      const value = Number(values.value);
                      if (maxQuantity !== null && value > maxQuantity) {
                        toast.warning(
                          `Quantidade máxima disponível: ${maxQuantity}`
                        );
                      }
                      field.onChange(values.value);
                    }}
                    allowNegative={false}
                    isAllowed={(values) => {
                      const value = Number(values.value);
                      return maxQuantity === null || value <= maxQuantity;
                    }}
                  />
                )}
              />
              <FormMessage>
                {form.formState.errors.quantity?.message}
              </FormMessage>
            </div>

            {maxQuantity !== null && (
              <p className="text-sm text-muted-foreground">
                Estoque disponível: {maxQuantity}
              </p>
            )}

            {salePrice > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Preço unitário: {CurrencyFormatter.format(salePrice)}
                </p>
                <p className="text-sm font-medium">
                  Subtotal: {CurrencyFormatter.format(subTotal)}
                </p>
              </div>
            )}
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

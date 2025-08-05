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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import { z } from "zod";
import { productSchema } from "../../../_utils/validations/create-sale";
import { toast } from "sonner";
import { getProductsAction } from "@/app/(protected)/(dashboard)/products/_actions/get-products";
import { ProductListItem } from "@/domain/services/product/product-service";
import { UsedStock } from "../../..";

interface IProps {
  tenantId: string;
  appendProduct: (payload: AddProductSchema) => void;
  usedStock: {
    state: UsedStock[];
    set: Dispatch<SetStateAction<UsedStock[]>>;
  };
}

export type AddProductSchema = z.infer<typeof productSchema>;

const formDefaultValues: AddProductSchema = {
  productId: "",
  name: "",
  salePrice: 0,
  quantity: 1,
};

export const AddProduct = ({ appendProduct, tenantId, usedStock }: IProps) => {
  const [open, setOpen] = useState(false);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);

  const form = useForm<AddProductSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(productSchema),
  });

  const { productId, quantity, salePrice } = form.watch();

  const maxQuantity = useMemo(() => {
    if (!stockQuantity) return null;

    const usedQuantity = usedStock.state
      .find(item => item.productId == productId);

    if (!usedQuantity) return stockQuantity;

    return Math.max(stockQuantity - usedQuantity.quantity, 0);
  }, [stockQuantity, usedStock]);

  const onSubmit = (formData: AddProductSchema) => {
    const qty = formData.quantity;
    if (maxQuantity !== null && qty > maxQuantity) {
      toast.error(`Quantidade máxima disponível: ${maxQuantity}`);
      return;
    }

    appendProduct(formData);
    setOpen(false);
    form.reset(formDefaultValues);
    setStockQuantity(null);
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
      form.setError("productId", { message: "mínimo de 3 caracteres." });
      return { options: [], additional, hasMore: true };
    }

    const curPage = additional!.page;
    const pageSize = additional!.itemsPerPage;

    const result = await getProductsAction({
      query: input.trim(),
      active: true,
      limit: pageSize,
      page: curPage,
      tenantId,
      includeAvailableQty: true,
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
                name="productId"
                render={({ field }) => (
                  <SelectPaginated<ProductListItem>
                    className="text-sm"
                    placeholder="Buscar um produto..."
                    menuPlacement="bottom"
                    loadOptions={loadPaginatedSearchProducts}
                    debounceTimeout={1000}
                    onInputChange={() => form.clearErrors("productId")}
                    onChange={(option) => {
                      const product = option!.value;
                      field.onChange(product.id);
                      form.setValue("name", option!.label);
                      form.setValue("salePrice", product.salePrice);
                      setStockQuantity(product.availableQty as number);
                    }}
                    additional={{
                      page: 1,
                      itemsPerPage: 10,
                    }}
                  />
                )}
              />
              <FormMessage>{form.formState.errors.productId?.message}</FormMessage>
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
                      field.onChange(value);
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

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
import { useMemo, useState } from "react";
import { Controller, UseFieldArrayReturn, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import { z } from "zod";
import { CreateSaleSchema, productSchema } from "../../../_utils/validations/create-sale";
import { toast } from "sonner";
import { getProductsAction } from "@/app/(protected)/(dashboard)/products/_actions/get-products";
import { ProductListItem } from "@/domain/services/product/product-service";

interface IProps {
  tenantId: string;
  appendProduct: (product: AddProductSchema) => void;
  fields: UseFieldArrayReturn<CreateSaleSchema, "products">["fields"];
}

export type AddProductSchema = z.infer<typeof productSchema>;

const formDefaultValues = {
  productId: "",
  name: "",
  salePrice: 0,
  quantity: 1,
  flatComposition: [],
  availableQty: undefined,
};

export const AddProduct = ({ appendProduct, tenantId, fields }: IProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddProductSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(productSchema),
  });

  const usedStock = useMemo(() => {
    const map = new Map<string, number>();

    for (const product of fields) {
      for (const comp of product.flatComposition) {
        const relativeQuantity = comp.usedQuantity * product.quantity;

        const prevInUse = map.get(comp.productId) || 0;
        map.set(comp.productId, prevInUse + relativeQuantity);
      }
    }

    return map;
  }, [fields]);

  const {
    productId,
    quantity,
    availableQty,
    flatComposition,
    salePrice,
  } = form.watch();

  // TODO: comments with explanation.
  const maxQuantity = useMemo(() => {
    if (availableQty == undefined) return null;

    let min: number = availableQty;

    for (const comp of flatComposition) {
      const qtyInUse = usedStock.get(comp.productId);
      if (!qtyInUse) continue;

      const currentUnits = comp.availableQty - qtyInUse;
      const possibleUnits = Math.floor(currentUnits / comp.usedQuantity);

      if (possibleUnits < min) min = possibleUnits;
    }

    return min;
  }, [availableQty, flatComposition, usedStock]);

  const onSubmit = (formData: AddProductSchema) => {
    const qty = formData.quantity;
    if (maxQuantity !== null && qty > maxQuantity) {
      toast.error(`Quantidade máxima disponível: ${maxQuantity}`);
      return;
    }

    appendProduct(formData);
    setOpen(false);
    form.reset(formDefaultValues);
  };

  const handleSelectProduct = (selected: ProductListItem) => {
    form.setValue("productId", selected.id);
    form.setValue("name", selected.name);
    form.setValue("salePrice", selected.salePrice);
    form.setValue("flatComposition", selected.flatComposition!);
    form.setValue("availableQty", selected.availableQty!);
  }

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
      salable: true,
      tenantId,
      includeAvailableQty: true,
      includeFlatComposition: true,
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

  const subtotal = !!salePrice && !!quantity
    ? salePrice * quantity
    : undefined;

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
                render={() => (
                  <SelectPaginated<ProductListItem>
                    className="text-sm"
                    placeholder="Buscar um produto..."
                    menuPlacement="bottom"
                    loadOptions={loadPaginatedSearchProducts}
                    debounceTimeout={1000}
                    onInputChange={() => form.clearErrors("productId")}
                    onChange={(option) => {
                      const product = option!.value;
                      handleSelectProduct(product);
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

            {(maxQuantity !== null && !!productId) && (
              <p className="text-sm text-muted-foreground">
                Estoque disponível: {maxQuantity}
              </p>
            )}

            {(!!subtotal && !!salePrice) && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Preço unitário: {CurrencyFormatter.format(salePrice)}
                </p>
                <p className="text-sm font-medium">
                  Subtotal: {CurrencyFormatter.format(subtotal)}
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

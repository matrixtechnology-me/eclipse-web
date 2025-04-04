"use client";

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
import { Controller, UseFieldArrayAppend, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import {
  CreateSaleSchema,
  productSchema,
} from "../../../_utils/validations/create-sale";
import { getProducts, Product } from "../../../../_actions/get-products";
import { CurrencyFormatter } from "@/utils/formatters/currency";

interface IProps {
  appendProduct: UseFieldArrayAppend<CreateSaleSchema, "products">;
}

type OrderItemFormType = z.infer<typeof productSchema>;

const formDefaultValues: OrderItemFormType = {
  id: "",
  name: "",
  costPrice: 0,
  salePrice: 0,
  quantity: "1",
  /* discount: {
    amount: "0.00",
    variant: "cash",
  }, */
};

export const AddProduct = ({ appendProduct }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<OrderItemFormType>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(productSchema),
  });

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: OrderItemFormType) => {
        appendProduct(formData);
        setOpen(false);
        form.reset(formDefaultValues);
      },
      (errors) => console.log(errors)
    );
    submissionFn();
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
    });

    if (result.isFailure) {
      console.log("error fetching products");
      return { options: [], additional, hasMore: true };
    }

    const products = result.value.results;

    return {
      options: products.map((product) => ({
        value: product,
        label: product.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < result.value.pagination.totalItems,
    };
  };

  const { quantity, salePrice, costPrice } = form.watch();

  const subTotal = useMemo(
    () => (salePrice - costPrice) * Number(quantity),
    [quantity, salePrice]
  );

  useEffect(() => {
    if (subTotal == undefined || salePrice <= 0) return;
    /* form.clearErrors("discount");

    if (subTotal <= 0) {
      form.setError("discount", {
        message: "valor de desconto inválido.",
      });
    } */
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
                      field.onChange(option!.value.id);
                      form.setValue("name", option!.label);
                      form.setValue("salePrice", option!.value.salePrice);
                      form.setValue("costPrice", option!.value.costPrice);
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
                      field.onChange(values.value);
                    }}
                  />
                )}
              />
              <FormMessage>
                {form.formState.errors.quantity?.message}
              </FormMessage>
            </div>

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
            onClick={form.handleSubmit(onSubmit)}
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

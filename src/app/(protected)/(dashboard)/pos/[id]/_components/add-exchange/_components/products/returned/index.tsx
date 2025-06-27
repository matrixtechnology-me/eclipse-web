import React, { FC, Fragment, useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../..";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { AddReturnedProduct } from "./add";

export const ExchangeReturnedProducts: FC = () => {
  const form = useFormContext<FormSchema>();

  const fieldArray = useFieldArray<FormSchema, "products.returned">({
    name: "products.returned",
    control: form.control,
  });

  const products = useWatch<FormSchema, "sale.products">({
    name: "sale.products",
    control: form.control,
  });

  useEffect(() => {
    fieldArray.remove(); // clear
  }, [products]);

  if (products == undefined) return <React.Fragment />;

  return (
    <FormField
      control={form.control}
      name="products.returned"
      render={() => (
        <FormItem>
          <FormLabel>Produtos para devolução</FormLabel>
          <div className="w-full overflow-x-auto">
            <FormControl>
              <div className="w-full border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Nome</TableHead>
                      <TableHead className="text-left">Qntd</TableHead>
                      <TableHead className="text-left">Preço de venda</TableHead>
                      <TableHead className="text-left">Subtotal</TableHead>
                      <TableHead className="text-center min-w-[80px]">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      // Checks if is beeing returnded in some quantity.
                      const relatedField = fieldArray.fields.find(
                        field => field.itemId === product.itemId,
                      );

                      const handleAdd = (qty: number) => {
                        const payload = {
                          itemId: product.itemId,
                          salePrice: product.salePrice,
                          totalQty: qty,
                        };

                        if (!!relatedField) {
                          const index = fieldArray.fields.findIndex(
                            field => field.id === relatedField.id
                          );

                          return fieldArray.update(index, payload);
                        }

                        fieldArray.append(payload);
                      };

                      return (
                        <Fragment key={product.itemId}>
                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="flex flex-col justify-center">
                                {product.name}

                                {!!relatedField && (
                                  <span className="text-[13px] text-muted-foreground">
                                    Devolvendo {relatedField.totalQty} unidade(s)
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="font-medium">
                              {product.totalQty}
                            </TableCell>

                            <TableCell className="font-medium">
                              {CurrencyFormatter.format(product.salePrice)}
                            </TableCell>

                            <TableCell className="font-medium">
                              {CurrencyFormatter.format(
                                product.salePrice * product.totalQty
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2 px-1">
                                <AddReturnedProduct
                                  originalQty={product.totalQty}
                                  currentQty={relatedField?.totalQty || 0}
                                  onSubmit={handleAdd}
                                />

                                <Button
                                  variant="outline"
                                  className="p-0 size-9 cursor-pointer"
                                  disabled={!relatedField}
                                  onClick={() => {
                                    fieldArray.remove(
                                      fieldArray.fields.indexOf(
                                        relatedField!
                                      )
                                    );
                                  }}
                                >
                                  <TrashIcon className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
import React, { FC, Fragment } from "react";
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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { AddReplacementProduct } from "./add";
import { formatDinero } from "@/lib/dinero/formatter";
import { createDinero } from "@/lib/dinero/factory";

type Props = {
  tenantId: string;
}

export const ExchangeReplacementProducts: FC<Props> = ({
  tenantId,
}) => {
  const form = useFormContext<FormSchema>();

  const sale = useWatch<FormSchema, "sale">({
    name: "sale",
    control: form.control,
  });

  const fieldArray = useFieldArray<FormSchema, "products.replacement">({
    name: "products.replacement",
    control: form.control,
  });

  if (!sale) return <React.Fragment />;

  return (
    <FormField
      control={form.control}
      name="products.replacement"
      render={() => (
        <FormItem>
          <div className="w-full flex items-center gap-3 justify-between">
            <FormLabel>Produtos para retirada</FormLabel>

            <AddReplacementProduct
              tenantId={tenantId}
              handleAppend={fieldArray.append}
            />
          </div>

          <div className="w-full overflow-x-auto">
            <FormControl>
              <div className="w-full border rounded-lg">
                {fieldArray.fields.length < 1
                  ? (
                    <div className="w-full px-5 py-12 flex items-center justify-center border border-dashed rounded-lg">
                      <p className="text-center text-muted-foreground text-sm">
                        Clique em "Adicionar" para adicionar produtos de retirada para a troca.
                      </p>
                    </div>
                  ) : (
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
                        {fieldArray.fields.map((field) => (
                          <Fragment key={field.productId}>
                            <TableRow>
                              <TableCell className="font-medium">
                                {field.name}
                              </TableCell>

                              <TableCell className="font-medium">
                                {field.quantity}
                              </TableCell>

                              <TableCell className="font-medium">
                                {formatDinero(createDinero(field.salePrice))}
                              </TableCell>

                              <TableCell className="font-medium">
                                {formatDinero(
                                  createDinero(field.salePrice)
                                    .multiply(field.quantity)
                                )}
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2 px-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="p-0 size-9 cursor-pointer"
                                    onClick={() => {
                                      fieldArray.remove(
                                        fieldArray.fields.indexOf(field)
                                      );
                                    }}
                                  >
                                    <TrashIcon className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
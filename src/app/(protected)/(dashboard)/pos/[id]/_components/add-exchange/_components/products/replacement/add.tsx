import { ProductListItem } from "@/app/(protected)/(dashboard)/products/_actions/get-products";
import { ProductAsyncSelect } from "@/components/domain/entities/product-async-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

const schema = z.object({
  productId: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, { message: "Campo obrigatório." }),
  name: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, { message: "Campo obrigatório." }),
  salePrice: z
    .number({ required_error: "Campo obrigatório." })
    .gt(0.0, { message: "Quantidade inválida." }),
  quantity: z
    .number({ required_error: "Campo obrigatório." })
    .gt(0.0, { message: "Quantidade inválida." }),
});

type ReplacementProductForm = z.infer<typeof schema>;

const PAGE = 1;
const PAGE_SIZE = 99;

type Props = {
  tenantId: string;
  handleAppend: (product: ReplacementProductForm) => void;
}

export const AddReplacementProduct = ({
  tenantId,
  handleAppend,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<ReplacementProductForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: undefined,
      name: undefined,
      salePrice: undefined,
      quantity: 0,
    },
  });

  const handleSelect = (prod: ProductListItem) => {
    form.setValue("productId", prod.id, { shouldValidate: true });
    form.setValue("name", prod.name, { shouldValidate: true });
    form.setValue("salePrice", prod.salePrice, { shouldValidate: true });
  }

  const handleAdd = (formData: ReplacementProductForm) => {
    handleAppend(formData);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          Adicionar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar produto de retirada</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <ProductAsyncSelect
                      {...field}
                      onChange={handleSelect}
                      page={PAGE}
                      pageSize={PAGE_SIZE}
                      tenantId={tenantId}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      className="h-9"
                      placeholder="Unidades do produto de devolução"
                      fixedDecimalScale={true}
                      thousandSeparator="."
                      decimalSeparator=","
                      {...field}
                      onChange={({ target }) => {
                        if (target.value === "") {
                          field.onChange(0);
                          return;
                        }
                        const raw = CurrencyFormatter.unformat(target.value);
                        field.onChange(raw);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleAdd)}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
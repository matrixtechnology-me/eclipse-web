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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FC, useState } from "react";
import { EPosStatus } from "@prisma/client";
import { CustomerAsyncSelect } from "@/components/domain/entities/customer-async-select";
import { CustomerSale } from "./_components/sale";
import { ExchangeReturnedProducts } from "./_components/products/returned";
import { ExchangeReplacementProducts } from "./_components/products/replacement";
import { ExchangeResume } from "./_components/resume";
// import { createPosSalePaymentAction } from "./_actions/create-pos-sale-payment";
// import { revalidate } from "./_actions/revalidate";

// This data will be used to data collection and rendering.
// Not all this structure is used for the mutation.
const formSchema = z.object({
  customerId: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, "Campo obrigatório."),
  sale: z
    .object({
      id: z.string(),
      paidTotal: z.number().gte(0.0),
      estimatedTotal: z.number().gt(0.0),
      totalItems: z.number().gt(0.0),
      products: z.array(
        z.object({
          itemId: z.string(), // array itens with zod have 'id' prop
          name: z.string(),
          salePrice: z.number().gt(0.0),
          totalQty: z.number().gt(0.0),
          productId: z.string(),
        }),
      ),
    }, { required_error: "Campo obrigatório." }),
  products: z.object({
    returned: z.array(
      z.object({
        productId: z.string(),
        salePrice: z.number().gt(0.0),
        totalQty: z.number().gt(0.0),
      }),
    ).min(1, "Mínimo de um item."),
    replacement: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        salePrice: z.number().gt(0.0),
        quantity: z.number().gt(0.0),
      }),
    ).min(1, "Mínimo de um item."),
  }),
});

export type FormSchema = z.infer<typeof formSchema>;

type AddExchangeProps = {
  posId: string;
  posStatus: EPosStatus;
  tenantId: string;
};

export const AddExchange: FC<AddExchangeProps> = ({
  posId,
  posStatus,
  tenantId,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: undefined,
      sale: undefined,
      products: {
        replacement: [],
        returned: [],
      },
    },
  });

  const onSubmit = async (formData: FormSchema) => {
    console.log(formData);
    // const result = await createPosSalePaymentAction({
    //   ...formData,
    //   tenantId,
    // });

    // if (result.isFailure) {
    //   return toast("Erro", {
    //     description: "Não foi possível criar um novo ponto de venda",
    //   });
    // }

    // revalidate({ posId, tenantId });

    // setOpen(false);
    // form.reset();
    // toast("Pagamento criado com sucesso");
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={posStatus !== EPosStatus.Opened}
        >
          Nova Troca
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-4xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar troca</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 min-h-[300px]"
          >
            <div className="flex-1 w-full grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-3 flex-1 shrink-0">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <CustomerAsyncSelect
                          {...field}
                          onValueChange={field.onChange}
                          tenantId={tenantId}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <CustomerSale tenantId={tenantId} />

                <ExchangeReturnedProducts />

                <ExchangeReplacementProducts tenantId={tenantId} />
                {/* <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EPaymentMethod).map(p => (
                          <SelectItem key={p} value={p}>
                            {PaymentMethodPresenter.present(p)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantia</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value === 0 ? "" : field.value}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      customInput={Input}
                      onValueChange={({ floatValue }) => {
                        field.onChange(floatValue ?? 0);
                      }}
                      onFocus={(e) => {
                        if (field.value === 0) {
                          e.currentTarget.setSelectionRange(
                            e.currentTarget.value.length,
                            e.currentTarget.value.length
                          );
                        }
                      }}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
              </div>

              <ExchangeResume />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Salvando alterações..."
                  : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

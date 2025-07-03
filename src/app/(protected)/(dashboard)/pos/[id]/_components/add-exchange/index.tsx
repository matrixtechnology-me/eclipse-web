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
import { EPaymentMethod, EPosStatus, ESaleMovementType } from "@prisma/client";
import { CustomerAsyncSelect } from "@/components/domain/entities/customer-async-select";
import { CustomerSale } from "./_components/sale";
import { ExchangeReturnedProducts } from "./_components/products/returned";
import { ExchangeReplacementProducts } from "./_components/products/replacement";
import { ExchangePricing } from "./_components/pricing";
// import { createPosSalePaymentAction } from "./_actions/create-pos-sale-payment";
// import { revalidate } from "./_actions/revalidate";

// This data willa also be used for rendering.
// Not all this structure is used for data collection.
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
          itemId: z.string(), // zod fieldArrays have internal 'id' prop.
          name: z.string(),
          salePrice: z.number().gt(0.0),
          totalQty: z.number().gt(0.0),
          productId: z.string(),
        }),
      ),
      movements: z.array(
        z.object({
          type: z.nativeEnum(ESaleMovementType),
          amount: z.number().gt(0.0),
          paymentMethod: z.nativeEnum(EPaymentMethod),
        }),
      ),
    }, { required_error: "Campo obrigatório." }),
  discount: z.object({
    value: z.number().gt(0.0, "Valor deve ser maior que zero."),
    type: z.enum(["cash", "percentage"]),
  })
    .optional()
    .refine(arg => {
      if (!arg || arg.type == "cash") return true;
      return arg.value < 1;
    }, {
      message: "Porcentagem deve ser menor que 100%.",
      path: ["value"],
    }),
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
  movements: z.array(
    z.object({
      type: z.nativeEnum(ESaleMovementType),
      amount: z.number().gt(0.0),
      paymentMethod: z.nativeEnum(EPaymentMethod),
    }),
  ),
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
      movements: [],
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) form.reset(); // reset on close
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={posStatus !== EPosStatus.Opened}
        >
          Nova Troca
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-5xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Realizar troca</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 min-h-[300px]"
          >
            <div className="flex-1 w-full grid grid-cols-2 gap-6">
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
              </div>

              <ExchangePricing />
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

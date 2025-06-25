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
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FC, useState } from "react";
import { NumericFormat } from "react-number-format";
import { EPaymentMethod, EPosStatus } from "@prisma/client";
import { Customer } from "./_components/customer";
import { CustomerSale } from "./_components/sale";
import { PaymentMethodPresenter } from "@/utils/presenters/payment-method";

const formSchema = z.object({
  customerId: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, "Campo obrigatório."),
  saleId: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, "Campo obrigatório."),
  amount: z
    .number({ required_error: "Campo obrigatório." })
    .min(0.01, { message: "A quantia precisa ser maior que zero." }),
  paymentMethod: z
    .nativeEnum(EPaymentMethod, { required_error: "Campo obrigatório." }),
});

export type FormSchema = z.infer<typeof formSchema>;

type AddPaymentProps = {
  posId: string;
  posStatus: EPosStatus;
  tenantId: string;
};

export const AddPayment: FC<AddPaymentProps> = ({
  posId,
  posStatus,
  tenantId,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: undefined,
      saleId: undefined,
      amount: 0,
      paymentMethod: EPaymentMethod.Cash,
    },
  });

  const onSubmit = async (formData: FormSchema) => {
    console.log(formData);
    // const result = await createPosPaymentAction({
    //   amount: values.amount,
    //   description: values.description,
    //   posId,
    //   tenantId,
    // });

    // if (result.isFailure) {
    //   return toast("Erro", {
    //     description: "Não foi possível criar um novo ponto de venda",
    //   });
    // }

    // setOpen(false);
    // form.reset();
    // toast("Entrada criada com sucesso");
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
          Novo Pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar pagamento</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <Customer tenantId={tenantId} />

            <CustomerSale tenantId={tenantId} />

            <FormField
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
            />

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

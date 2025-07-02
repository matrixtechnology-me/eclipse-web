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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethodPresenter } from "@/utils/presenters/payment-method";
import { SaleMovementTypePresenter } from "@/utils/presenters/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import { useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { FormSchema } from "../../../..";

const schema = z.object({
  type: z
    .nativeEnum(ESaleMovementType, { required_error: "Campo obrigatório." }),
  amount: z
    .number({ required_error: "Campo obrigatório." })
    .gt(0.0, { message: "Quantidade inválida." }),
  paymentMethod: z
    .nativeEnum(EPaymentMethod, { required_error: "Campo obrigatório." })
});

type ExchangeMovementForm = z.infer<typeof schema>;

type Props = {
  handleAppend: (movement: ExchangeMovementForm) => void;
}

export const AddExchangeMovement = ({
  handleAppend,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const mainForm = useFormContext<FormSchema>();

  const sale = useWatch({
    name: "sale",
    control: mainForm.control,
  });

  const form = useForm<ExchangeMovementForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined,
      amount: 0.0,
      paymentMethod: undefined,
    },
  });

  const handleAdd = (formData: ExchangeMovementForm) => {
    handleAppend(formData);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer" disabled={!sale}>
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar movimentação de venda</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo de movimentação" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          ESaleMovementType.Payment,
                          ESaleMovementType.Change,
                        ].map(t => (
                          <SelectItem key={t} value={t}>
                            {SaleMovementTypePresenter.present(t)}
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
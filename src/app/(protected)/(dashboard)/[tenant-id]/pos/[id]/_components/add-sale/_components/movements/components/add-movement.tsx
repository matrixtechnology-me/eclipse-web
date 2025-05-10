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
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSaleSchema,
  movementSchema,
} from "../../../_utils/validations/create-sale";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  appendMovement: UseFieldArrayAppend<CreateSaleSchema, "movements">;
}

type MovementItemFormType = z.infer<typeof movementSchema>;

const formDefaultValues: MovementItemFormType = {
  type: ESaleMovementType.Payment,
  method: EPaymentMethod.Cash,
  amount: 0,
};

export const AddMovement = ({ appendMovement }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<MovementItemFormType>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(movementSchema),
  });

  const watchedMovementType = form.watch().type;

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: MovementItemFormType) => {
        appendMovement(formData);
        setOpen(false);
        form.reset(formDefaultValues);
      },
      (errors) => console.log(errors)
    );
    submissionFn();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar movimentação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar movimentação</DialogTitle>
          <DialogDescription>
            Selecione um movimentação e informe a quantidade
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo da movimentação*</Label>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo de movimentação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ESaleMovementType.Change}>
                        Troco
                      </SelectItem>
                      <SelectItem value={ESaleMovementType.Payment}>
                        Pagamento
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormMessage>{form.formState.errors.method?.message}</FormMessage>
            </div>

            <div className="space-y-2">
              <Label>Forma de pagamento*</Label>
              <Controller
                control={form.control}
                name="method"
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EPaymentMethod.Cash}>
                        Dinheiro
                      </SelectItem>
                      {watchedMovementType === ESaleMovementType.Payment ? (
                        <SelectItem value={EPaymentMethod.DebitCard}>
                          Cartão de débito
                        </SelectItem>
                      ) : null}
                      {watchedMovementType === ESaleMovementType.Payment ? (
                        <SelectItem value={EPaymentMethod.CreditCard}>
                          Cartão de crédito
                        </SelectItem>
                      ) : null}
                      <SelectItem value={EPaymentMethod.Pix}>Pix</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormMessage>{form.formState.errors.method?.message}</FormMessage>
            </div>

            <div className="space-y-2">
              <Label>Valor*</Label>
              <Controller
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <NumericFormat
                    customInput={Input}
                    placeholder="Valor"
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(Number(values.value));
                    }}
                  />
                )}
              />
              <FormMessage>{form.formState.errors.amount?.message}</FormMessage>
            </div>
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
              : "Adicionar movimentação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

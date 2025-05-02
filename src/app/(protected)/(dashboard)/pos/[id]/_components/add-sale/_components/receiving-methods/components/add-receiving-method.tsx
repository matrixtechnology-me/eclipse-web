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
  receivingMethod,
} from "../../../_utils/validations/create-sale";
import { ESaleMovementPaymentMethod } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  appendProduct: UseFieldArrayAppend<CreateSaleSchema, "receivingMethods">;
}

type ReceivingMethodItemFormType = z.infer<typeof receivingMethod>;

const formDefaultValues: ReceivingMethodItemFormType = {
  method: ESaleMovementPaymentMethod.Cash,
  amount: 0,
};

export const AddProduct = ({ appendProduct }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<ReceivingMethodItemFormType>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(receivingMethod),
  });

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: ReceivingMethodItemFormType) => {
        appendProduct(formData);
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
          Adicionar forma de recebimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar forma de recebimento</DialogTitle>
          <DialogDescription>
            Selecione um forma de recebimento e informe a quantidade
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Método de recebimento*</Label>
              <Controller
                control={form.control}
                name="method"
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um método de recebimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ESaleMovementPaymentMethod.Cash}>
                        Dinheiro
                      </SelectItem>
                      <SelectItem value={ESaleMovementPaymentMethod.DebitCard}>
                        Cartão de débito
                      </SelectItem>
                      <SelectItem value={ESaleMovementPaymentMethod.CreditCard}>
                        Cartão de crédito
                      </SelectItem>
                      <SelectItem value={ESaleMovementPaymentMethod.Pix}>
                        Pix
                      </SelectItem>
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
              : "Adicionar forma de recebimento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

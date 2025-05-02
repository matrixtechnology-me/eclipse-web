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
import { Textarea } from "@/components/ui/textarea";
import { createPosEntryAction } from "../_actions/create-pos-entry";
import { toast } from "sonner";
import { FC, useState } from "react";
import { NumericFormat } from "react-number-format";

const formSchema = z.object({
  amount: z.number().min(0.01, {
    message: "A quantia precisa ser maior que zero.",
  }),
  description: z.string().default(""),
});

type AddEntryProps = {
  posId: string;
};

export const AddEntry: FC<AddEntryProps> = ({ posId }) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createPosEntryAction({
      amount: values.amount,
      description: values.description,
      posId,
    });

    if (result.isFailure) {
      return toast("Erro", {
        description: "Não foi possível criar um novo ponto de venda",
      });
    }

    setOpen(false);
    form.reset();
    toast("Entrada criada com sucesso");
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Nova Entrada</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar entrada</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-3"
          >
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-24" />
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

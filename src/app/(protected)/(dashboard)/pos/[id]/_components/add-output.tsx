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
import { createPosOutputAction } from "../_actions/create-pos-output";
import { toast } from "sonner";
import { FC, useState } from "react";

const formSchema = z.object({
  amount: z.number().min(2, {
    message: "A quantia precisa ser maior que zero.",
  }),
  description: z.string().default(""),
});

type AddOutputProps = {
  posId: string;
};

export const AddOutput: FC<AddOutputProps> = ({ posId }) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createPosOutputAction({
      amount: values.amount,
      description: values.description,
      posId,
    });

    if (result.isFailure) {
      return toast("Erro", {
        description: "Não foi possível criar um novo ponto de venda",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Nova Saída</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar saída</DialogTitle>
          <DialogDescription>
            Faça alterações e clique em "Salvar" quando terminar.
          </DialogDescription>
        </DialogHeader>
        {/* Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
            className="grid grid-cols-1 gap-3"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={({ target: { value } }) => {
                        const mappedValue = Number(value);
                        field.onChange(mappedValue);
                      }}
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

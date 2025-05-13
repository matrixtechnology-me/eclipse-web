"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { PatternFormat } from "react-number-format";

import { getServerSession } from "@/lib/session";
import { PhoneNumberFormatter } from "@/utils/formatters/phone-number";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createCustomer } from "../_actions/create-customer";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export const CreateCustomer = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async ({ name, phoneNumber }: FormSchema) => {
    try {
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada.");

      await createCustomer({
        name,
        phoneNumber: PhoneNumberFormatter.unformat(phoneNumber),
        tenantId: session.tenantId,
      });

      toast.success("Cliente criado com sucesso!");
      form.reset();
      setOpen(false);

      window.location.reload();
    } catch {
      toast.error("Erro ao criar cliente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className="text-primary font-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Marcos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Número de telefone{" "}
                    <span className="text-primary font-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      format="(##) #####-####"
                      placeholder="Número de telefone do usuário"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

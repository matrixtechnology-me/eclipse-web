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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getServerSession } from "@/lib/session";
import { createLot } from "../../../../_actions/create-lot";
import { DatePicker } from "./date-picker";
import { toast } from "sonner";
import { CurrencyInput } from "./currency-input";

const createLotSchema = z.object({
  costPrice: z.number().min(0.01, "Preço deve ser maior que zero"),
  totalQty: z.number().min(1, "Quantidade mínima é 1"),
  expiresAt: z.date().optional(),
});

export type CreateLotSchema = z.infer<typeof createLotSchema>;

const formDefaultValues: CreateLotSchema = {
  costPrice: 0,
  totalQty: 0,
  expiresAt: undefined,
};

type AddLotProps = {
  stockId: string;
};

export const AddLot = ({ stockId }: AddLotProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateLotSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(createLotSchema),
  });

  const onSubmit = async (formData: CreateLotSchema) => {
    try {
      setIsSubmitting(true);
      const session = await getServerSession();
      if (!session) throw new Error("Sessão não encontrada");

      await createLot({
        ...formData,
        stockId,
        tenantId: session.tenantId,
      });

      toast.success("Lote criado com sucesso");
      form.reset(formDefaultValues);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar lote"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove leading zeros
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
      if (value === "") value = "0"; // Garante que não fique vazio
    }

    form.setValue("totalQty", Number(value));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-fit h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar lote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar lote</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo lote
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de custo*</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="R$ 0,00"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantidade em estoque"
                      value={field.value}
                      onChange={handleQuantityChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de validade (opcional)</FormLabel>
                  <FormControl>
                    <DatePicker onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

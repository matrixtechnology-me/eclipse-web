"use client";

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
import { useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getServerSession } from "@/lib/session";
import { addStockEntry } from "../../_actions/add-stock-entry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const addStockEntrySchema = z.object({
  stockLotId: z.string().min(1, "Selecione um lote"),
  totalQty: z.number().min(1, "Quantidade mínima é 1"),
});

type AddStockEntrySchema = z.infer<typeof addStockEntrySchema>;

type AddStockEntryProps = {
  stockLots: {
    id: string;
    lotNumber: string;
  }[];
  stockId: string;
};

export const AddStockEntry = ({ stockId, stockLots }: AddStockEntryProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddStockEntrySchema>({
    defaultValues: {
      stockLotId: stockLots[0]?.id || "",
      totalQty: 0,
    },
    resolver: zodResolver(addStockEntrySchema),
  });

  const onSubmit = async (formData: AddStockEntrySchema) => {
    try {
      setIsSubmitting(true);
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      await addStockEntry({
        stockId,
        stockLotId: formData.stockLotId,
        tenantId: session.tenantId,
        totalQty: formData.totalQty,
      });

      toast.success("Entrada de estoque registrada com sucesso");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao registrar entrada"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
      if (value === "") value = "0";
    }
    form.setValue("totalQty", Number(value));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <ArrowUpIcon className="size-4" />
          Nova entrada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova entrada</DialogTitle>
          <DialogDescription>
            Informe os dados da entrada de estoque
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stockLotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lote*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockLots.map((lot) => (
                          <SelectItem key={lot.id} value={lot.id}>
                            {lot.lotNumber.toUpperCase()}
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
              name="totalQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantidade"
                      value={field.value}
                      onChange={handleQuantityChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando alterações..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

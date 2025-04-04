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
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getServerSession } from "@/lib/session";
import { addStockOutput } from "../../../_actions/add-stock-output";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const addStockOutputSchema = z.object({
  stockLotId: z.string().min(1, "Selecione um lote válido"),
  totalQty: z.number().min(1, "Quantidade deve ser maior que zero"),
});

type AddStockOutputSchema = z.infer<typeof addStockOutputSchema>;

type AddStockOutputProps = {
  stockLots: {
    id: string;
    lotNumber: string;
    totalQty: number;
  }[];
  stockId: string;
};

export const AddStockOutput = ({ stockId, stockLots }: AddStockOutputProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddStockOutputSchema>({
    defaultValues: {
      stockLotId: stockLots[0]?.id || "",
      totalQty: 0,
    },
    resolver: zodResolver(addStockOutputSchema),
  });

  const selectedLotId = form.watch("stockLotId");
  const selectedLot = stockLots.find((lot) => lot.id === selectedLotId);

  const onSubmit = async (formData: AddStockOutputSchema) => {
    try {
      setIsSubmitting(true);

      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      // Validate available quantity
      const selectedLot = stockLots.find(
        (lot) => lot.id === formData.stockLotId
      );
      if (selectedLot && formData.totalQty > selectedLot.totalQty) {
        throw new Error("Quantidade indisponível no lote selecionado");
      }

      await addStockOutput({
        stockId,
        stockLotId: formData.stockLotId,
        tenantId: session.tenantId,
        totalQty: formData.totalQty,
      });

      toast.success("Saída de estoque registrada com sucesso");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao registrar saída"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove leading zeros and convert to number
    const numericValue =
      value === "" ? 0 : parseInt(value.replace(/^0+/, "")) || 0;
    form.setValue("totalQty", numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Registrar saída
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar saída de estoque</DialogTitle>
          <DialogDescription>
            Registre a saída de produtos do estoque
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
                          <SelectItem
                            key={lot.id}
                            value={lot.id}
                            disabled={lot.totalQty <= 0}
                          >
                            {lot.lotNumber.toUpperCase()} (Disponível:{" "}
                            {lot.totalQty})
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={selectedLot?.totalQty}
                        placeholder="Quantidade"
                        value={field.value || ""}
                        onChange={handleQuantityChange}
                      />
                    </FormControl>
                    {selectedLot && (
                      <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                        Máx: {selectedLot.totalQty}
                      </span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !selectedLot?.totalQty}
              >
                {isSubmitting ? "Registrando..." : "Registrar saída"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

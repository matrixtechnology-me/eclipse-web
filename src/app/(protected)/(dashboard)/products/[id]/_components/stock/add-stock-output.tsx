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
import { FieldErrors, useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { getServerSession } from "@/lib/session";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStockOutput } from "../../../_actions/add-stock-output";

const addStockOutputSchema = z.object({
  stockLotId: z.string(),
  totalQty: z.number(),
});

type AddStockOutputSchema = z.infer<typeof addStockOutputSchema>;

type AddStockOutputProps = {
  stockLots: {
    id: string;
    lotNumber: string;
  }[];
  stockId: string;
};

export const AddStockOutput: FC<AddStockOutputProps> = ({
  stockId,
  stockLots,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const formDefaultValues: AddStockOutputSchema = {
    stockLotId: stockLots[0]?.id,
    totalQty: 0,
  };

  const form = useForm<AddStockOutputSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(addStockOutputSchema),
  });

  const onSubmit = async (formData: AddStockOutputSchema) => {
    const session = await getServerSession();

    if (!session) throw new Error("session not found");

    await addStockOutput({
      stockId,
      stockLotId: formData.stockLotId,
      tenantId: session.tenantId,
      totalQty: formData.totalQty,
    });

    form.reset(formDefaultValues);
    setOpen(false);
  };

  const onErrors = (errors: FieldErrors<AddStockOutputSchema>) => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar saída
        </Button>
      </DialogTrigger>
      <DialogContent className="!p-0 flex flex-col no-scrollbar md:max-w-2xl h-fit overflow-hidden">
        <DialogHeader className="p-5 bg-primary-foreground">
          <DialogTitle>Adicionar saída</DialogTitle>
          <DialogDescription>
            Faça inserções para nova saída em estoque aqui. Clique em salvar
            quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form<AddStockOutputSchema> {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5"
          >
            <FormField
              control={form.control}
              name="stockLotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Número do lote<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stockLots.map((stockLot) => (
                          <SelectItem key={stockLot.id} value={stockLot.id}>
                            {stockLot.lotNumber.toUpperCase()}
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
                  <FormLabel>
                    Quantidade<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={({ target: { value } }) => {
                        field.onChange(Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-5 bg-primary-foreground/25">
              <Button className="min-w-32" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

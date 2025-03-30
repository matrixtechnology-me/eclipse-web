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
import { FieldErrors, useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { getServerSession } from "@/lib/session";
import { createLot } from "../../../../_actions/create-lot";
import { DatePicker } from "./date-picker";

import "moment/locale/pt-br";
import moment from "moment";
moment.locale("pt-br");

const createLotSchema = z.object({
  costPrice: z.number(),
  totalQty: z.number(),
  expiresAt: z.date().or(z.undefined()),
});

export type CreateLotSchema = z.infer<typeof createLotSchema>;

const formDefaultValues: CreateLotSchema = {
  costPrice: 0,
  totalQty: 0,
  expiresAt: moment().add(1, "month").toDate(),
};

type AddLotProps = {
  stockId: string;
};

export const AddLot: FC<AddLotProps> = ({ stockId }) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateLotSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(createLotSchema),
  });

  const onSubmit = async (formData: CreateLotSchema) => {
    const session = await getServerSession();

    if (!session) throw new Error("session not found");

    await createLot({
      costPrice: formData.costPrice,
      stockId,
      tenantId: session.tenantId,
      totalQty: formData.totalQty,
      expiresAt: formData.expiresAt,
    });

    form.reset(formDefaultValues);
    setOpen(false);
  };

  const onErrors = (errors: FieldErrors<CreateLotSchema>) => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar lote
        </Button>
      </DialogTrigger>
      <DialogContent className="!p-0 flex flex-col no-scrollbar md:max-w-2xl h-fit overflow-hidden">
        <DialogHeader className="p-5 bg-primary-foreground">
          <DialogTitle>Adicionar lote</DialogTitle>
          <DialogDescription>
            Faça inserções para novo lote aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form<CreateLotSchema> {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5"
          >
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preço de custo<span>*</span>
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
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantidade<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker onChange={field.onChange} value={field.value} />
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

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
import { Controller, UseFieldArrayAppend, useForm } from "react-hook-form";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductSchema,
  createVariationSchema,
} from "../../../../_utils/validations/create-product";
import { Specifications } from "./specifications";

interface IProps {
  appendVariation: UseFieldArrayAppend<CreateProductSchema, "variations">;
}

type CreateVariationSchema = z.infer<typeof createVariationSchema>;

const formDefaultValues: CreateVariationSchema = {
  salePrice: 0,
  costPrice: 0,
  image: new File([], ""),
  specifications: [],
};

export const AddVariation = ({ appendVariation }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateVariationSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(createVariationSchema),
  });

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: CreateVariationSchema) => {
        appendVariation(formData);
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
          Adicionar variação
        </Button>
      </DialogTrigger>
      <DialogContent className="!p-0 flex flex-col no-scrollbar md:max-w-2xl h-fit overflow-hidden">
        <DialogHeader className="p-5 bg-primary-foreground">
          <DialogTitle>Adicionar variação</DialogTitle>
          <DialogDescription>
            Faça inserções para nova variação aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form<CreateVariationSchema> {...form}>
          <form className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5">
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preço de custo<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preço de venda<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Specifications form={form} />
          </form>
          <DialogFooter className="p-5 bg-primary-foreground/25">
            <Button className="min-w-32" type="button" onClick={onSubmit}>
              Adicionar item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

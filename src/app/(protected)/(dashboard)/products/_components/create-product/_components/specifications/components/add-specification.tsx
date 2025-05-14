import {
  CreateProductSchema,
  createSpecificationsSchema,
} from "@/app/(protected)/(dashboard)/products/_components/create-product/_utils/validations/create-product";
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { UseFieldArrayAppend, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

interface IProps {
  appendSpecification: UseFieldArrayAppend<
    CreateProductSchema,
    "product.specifications"
  >;
}

type CreateSpecificationSchema = z.infer<typeof createSpecificationsSchema>;

const formDefaultValues: CreateSpecificationSchema = {
  label: "",
  value: "",
};

const CurrencyInput = forwardRef<
  HTMLInputElement,
  { onChange: (value: number) => void; value?: number; placeholder?: string }
>(({ onChange, value, placeholder, ...props }, ref) => (
  <NumericFormat
    getInputRef={ref}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={2}
    fixedDecimalScale
    prefix="R$ "
    placeholder={placeholder}
    value={value}
    onValueChange={(values) => onChange(values.floatValue || 0)}
    {...props}
  />
));

export const AddSpecification = ({ appendSpecification }: IProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateSpecificationSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(createSpecificationsSchema),
  });

  const onSubmit = (formData: CreateSpecificationSchema) => {
    appendSpecification(formData);
    setOpen(false);
    form.reset(formDefaultValues);
    toast.success("Variação adicionada com sucesso");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar especificação
        </Button>
      </DialogTrigger>
      <DialogContent className="!p-0 flex flex-col no-scrollbar w-md h-fit overflow-hidden">
        <DialogHeader className="p-5 bg-primary-foreground">
          <DialogTitle>Adicionar especificação</DialogTitle>
          <DialogDescription>
            Adicione as especificações do produto. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cor, Tamanho" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Vermelho, P" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="p-0 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="ml-auto"
              >
                {form.formState.isSubmitting ? "Salvando..." : "Adicionar item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

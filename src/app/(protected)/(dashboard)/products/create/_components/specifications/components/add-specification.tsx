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
import { UseFieldArrayAppend, useForm } from "react-hook-form";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductSchema,
  createSpecificationsSchema,
} from "@/app/(protected)/(dashboard)/products/create/_utils/validations/create-product";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import { forwardRef } from "react";

interface IProps {
  appendSpecification: UseFieldArrayAppend<
    CreateProductSchema,
    "specifications"
  >;
}

type CreateSpecificationSchema = z.infer<typeof createSpecificationsSchema>;

const formDefaultValues: CreateSpecificationSchema = {
  label: "",
  value: "",
};

// Componente customizado para Currency Input
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
    try {
      appendSpecification(formData);
      setOpen(false);
      form.reset(formDefaultValues);
      toast.success("Variação adicionada com sucesso");
    } catch (error) {
      toast.error("Erro ao adicionar variação");
    }
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
            Adicione as especificações do produto. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da especificação*</FormLabel>
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
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Vermelho, P" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>

          <DialogFooter className="p-5 bg-primary-foreground/25">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Salvando..." : "Adicionar item"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

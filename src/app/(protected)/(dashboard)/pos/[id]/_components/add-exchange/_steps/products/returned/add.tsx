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
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, UndoIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

type Props = {
  originalQty: number;
  currentQty: number;
  onSubmit: (qty: number) => void;
}

const schema = z.object({
  quantity: z
    .number({ required_error: "Campo obrigatório" })
    .gt(0.0, { message: "Quantidade inválida." }),
});

type FormSchema = z.infer<typeof schema>;

export const AddReturnedProduct = ({
  currentQty,
  originalQty,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema
      .refine(({ quantity }) => quantity <= originalQty, {
        message: "Quantidade inválida.",
        path: ["quantity"],
      }),
    ),
    defaultValues: { quantity: 0 },
  });

  const handleAdd = ({ quantity }: FormSchema) => {
    onSubmit(quantity);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="p-0 size-9 cursor-pointer"
        >
          {currentQty == 0
            ? <PencilIcon className="size-4" />
            : <UndoIcon className="size-4" />
          }
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar produto de devolução</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel>Quantidade</FormLabel>

                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      className="h-9"
                      placeholder="Unidades do produto de devolução"
                      fixedDecimalScale={true}
                      thousandSeparator="."
                      decimalSeparator=","
                      {...field}
                      onChange={({ target }) => {
                        if (target.value === "") {
                          field.onChange(0);
                          return;
                        }

                        const raw = CurrencyFormatter.unformat(target.value);
                        field.onChange(raw);
                      }}
                    />
                  </FormControl>

                  <div className="flex items-center justify-between gap-5">
                    <FormMessage />

                    <span className="flex-1 text-sm text-right">
                      Máximo de {originalQty} unidade(s)
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={form.handleSubmit(handleAdd)}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
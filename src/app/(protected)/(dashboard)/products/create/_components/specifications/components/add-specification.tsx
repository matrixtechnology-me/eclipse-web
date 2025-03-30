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

export const AddSpecification = ({ appendSpecification }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateSpecificationSchema>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(createSpecificationsSchema),
  });

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: CreateSpecificationSchema) => {
        appendSpecification(formData);
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
        <Form<CreateSpecificationSchema> {...form}>
          <form className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5">
            <FormField
              control={form.control}
              name="label"
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
              name="value"
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

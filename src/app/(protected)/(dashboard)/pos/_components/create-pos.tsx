"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";
import { Textarea } from "@/components/ui/textarea";
import { getServerSession } from "@/lib/session";
import { createPosAction } from "../_actions/create-pos";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome de usuário deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().default(""),
});

export const CreatePos = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const session = await getServerSession({
      requirements: {
        tenant: true,
      },
    });

    if (!session) throw new Error("session not found");

    const result = await createPosAction({
      description: values.description,
      name: values.name,
      tenantId: session.tenantId,
    });

    if (result.isFailure) {
      return toast("Erro", {
        description: "Não foi possível criar um novo ponto de venda",
      });
    }

    const { posId } = result.value;

    router.push(PATHS.PROTECTED.DASHBOARD.POS.POS(posId).INDEX);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Novo PDV</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo PDV</DialogTitle>
          <DialogDescription>
            Cadastre um novo ponto de venda para registrar vendas e acompanhar
            movimentações.
          </DialogDescription>
        </DialogHeader>
        {/* Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-48" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

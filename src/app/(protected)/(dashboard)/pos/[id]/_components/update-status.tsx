"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EPosStatus } from "@prisma/client";
import { FC } from "react";
import { updatePosStatusAction } from "../_actions/update-pos-status";
import { toast } from "sonner";

const formSchema = z.object({
  status: z.nativeEnum(EPosStatus, {
    required_error: "Por favor, selecione um status.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const items: { label: string; value: EPosStatus }[] = [
  {
    label: "Aberto",
    value: EPosStatus.Opened,
  },
  {
    label: "Fechado",
    value: EPosStatus.Closed,
  },
  {
    label: "Em análise/conferência",
    value: EPosStatus.UnderReview,
  },
];

type UpdateStatusProps = {
  value: EPosStatus;
  tenantId: string;
  posId: string;
};

export const UpdateStatus: FC<UpdateStatusProps> = ({
  posId,
  tenantId,
  value,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: value,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const result = await updatePosStatusAction({
      posId,
      status: data.status,
      tenantId,
    });

    if (result.isFailure) {
      toast.error("Não foi possível atualizar o status.");
      return;
    }

    toast.success("Status atualizado com sucesso.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value as EPosStatus);
                  form.handleSubmit(onSubmit)();
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

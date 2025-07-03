import React, { FC } from "react";
import { Label } from "@/components/ui/label";
import { ExchangeResumeItem } from "../../../../_types/resume";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ReactNode } from "react";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { CircleCheckIcon, PackagePlusIcon, PlusIcon, UndoIcon } from "lucide-react";

type Props = {
  resumeList: ExchangeResumeItem[];
  adjustedTotal: number;
}

type RenderElements = {
  label: string;
  icon: ReactNode;
  subtotalLabel: string;
}

const iconProps = { size: 15, strokeWidth: 2.5 };

const getRenderElements = (item: ExchangeResumeItem): RenderElements => {
  const subtotal = CurrencyFormatter.format(item.quantity * item.salePrice);

  switch (item.status) {
    case "new": return {
      label: "Incluído",
      icon: <PackagePlusIcon className="text-purple-400" {...iconProps} />,
      subtotalLabel: "+ " + subtotal
    };
    case "incremented": return {
      label: "Acrescentado",
      icon: <PlusIcon className="text-blue-400" {...iconProps} />,
      subtotalLabel: "+ " + subtotal
    };
    case "returned": return {
      label: "Devolvido",
      icon: <UndoIcon className="text-orange-500" {...iconProps} />,
      subtotalLabel: subtotal
    };
    case "kept": return {
      label: "Mantido",
      icon: <CircleCheckIcon className="text-green-500"  {...iconProps} />,
      subtotalLabel: "+ " + subtotal
    };
    default:
      throw new Error("Unmapped resume item status.");
  }
}

export const ExchangeResume: FC<Props> = ({ resumeList, adjustedTotal }) => {
  return (
    <div className="shrink-0 flex flex-col gap-2 overflow-x-auto">
      <Label>Resumo</Label>

      <div className="w-full border rounded-lg overflow-hidden">
        {resumeList.length < 1
          ? (
            <div className="w-full px-5 py-8 flex items-center justify-center border border-dashed rounded-lg">
              <p className="text-center text-muted-foreground text-sm">
                Selecione uma venda e produtos para retirada e devolução.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left sticky left-0 bg-background">
                    Status
                  </TableHead>
                  <TableHead className="text-left">Nome</TableHead>
                  <TableHead className="text-left">Qntd</TableHead>
                  <TableHead className="text-left">Preço</TableHead>
                  <TableHead className="text-left">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumeList.map((item) => {
                  const { icon, label, subtotalLabel } = getRenderElements(item);

                  return (
                    <TableRow key={`${item.productId}:${item.status}`}>
                      <TableCell className="font-medium sticky left-0 bg-background z-10">
                        <div className="w-min flex items-center gap-2 rounded-lg py-1 px-2 border b-slate-700 text-[13px]">
                          {icon}
                          {label}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="font-medium">
                        {CurrencyFormatter.format(item.salePrice)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {subtotalLabel}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-medium">
                  <TableCell className="left-0 sticky bg-background z-10">
                    Total ajustado
                  </TableCell>
                  <TableCell className="text-right" colSpan={4}>
                    {CurrencyFormatter.format(adjustedTotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
      </div>
    </div>
  );
}
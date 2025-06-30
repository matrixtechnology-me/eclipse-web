import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ResumeItem } from "..";
import { Fragment, useMemo } from "react";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { CircleCheckIcon, PlusIcon, UndoIcon } from "lucide-react";

type Props = {
  data: ResumeItem[];
}

const getLabel = (status: ResumeItem["status"]) => {
  switch (status) {
    case "replacement": return "Incluído";
    case "returned": return "Devolvido";
    case "unmodified": return "Mantido";
  }
}

const getIcon = (status: ResumeItem["status"]) => {
  const commonProps = { size: 15, strokeWidth: 2.5 };
  switch (status) {
    case "replacement":
      return <PlusIcon className="text-blue-400" {...commonProps} />;
    case "returned":
      return <UndoIcon className="text-orange-500" {...commonProps} />;
    case "unmodified":
      return <CircleCheckIcon className="text-green-500"  {...commonProps} />;
  }
}

const getSubtotalLabel = ({ status, quantity, salePrice }: ResumeItem) => {
  const subtotal = CurrencyFormatter.format(quantity * salePrice);

  switch (status) {
    case "replacement": return "+ " + subtotal;
    case "unmodified": return "+ " + subtotal;
    case "returned": return "- " + subtotal;
  }
}

const getTotal = (items: ResumeItem[]) => {
  const totalAmount = items.reduce((acc, item) => {
    const subtotal = item.salePrice * item.quantity;

    switch (item.status) {
      case "replacement": return acc + subtotal;
      case "unmodified": return acc + subtotal;
      case "returned": return acc - subtotal;
    };
  }, 0.0);

  return CurrencyFormatter.format(totalAmount);
}

export const ExchangeResumeTable = ({ data }: Props) => {
  const total = useMemo(() => getTotal(data), [data]);

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      {data.length < 1
        ? (
          <div className="w-full px-5 py-8 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-center text-muted-foreground text-sm">
              Escolha uma venda e produtos para retirada e devolução.
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
              {data.map((item) => (
                <Fragment key={`${item.productId}:${item.status}`}>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      <div className="w-min flex items-center gap-2 rounded-lg py-1 px-2 border b-slate-700 text-[13px]">
                        {getIcon(item.status)}
                        {getLabel(item.status)}
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
                      {getSubtotalLabel(item)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
              <TableRow className="font-medium">
                <TableCell className="left-0 sticky bg-background z-10">
                  Total
                </TableCell>
                <TableCell className="text-right" colSpan={4}>
                  {total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
    </div>
  );
}
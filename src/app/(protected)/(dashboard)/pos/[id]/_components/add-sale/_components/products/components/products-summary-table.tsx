import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { TrashIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import { CreateSaleSchema } from "../../../_utils/validations/create-sale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductsTableProps {
  productFields: UseFieldArrayReturn<CreateSaleSchema, "products">["fields"];
  removeProduct: (productId: string) => void;
}

export const ProductsTable = ({
  productFields,
  removeProduct,
}: ProductsTableProps) => {
  return productFields.length ? (
    <div className="max-w-[462px] relative overflow-x-auto hide-scrollbar border rounded-sm">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Unidades</TableHead>
            <TableHead className="text-left">Preço</TableHead>
            <TableHead className="text-left">Subtotal</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productFields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium max-w-[150px]">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="line-clamp-1 text-ellipsis overflow-hidden block">
                        {field.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="start"
                      className="max-w-[300px]"
                    >
                      <p className="text-sm">{field.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{field.quantity}</TableCell>
              <TableCell>{CurrencyFormatter.format(field.salePrice)}</TableCell>
              <TableCell className="text-left">
                {CurrencyFormatter.format(
                  Number(field.quantity) * field.salePrice
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="p-0 size-9"
                  onClick={() => removeProduct(field.productId)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-left">
              {CurrencyFormatter.format(
                productFields.reduce(
                  (acc, field) =>
                    acc + field.salePrice * Number(field.quantity),
                  0
                )
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ) : (
    <div className="w-full px-5 py-20 flex items-center justify-center border border-dashed rounded-sm">
      <p className="text-center">
        Nenhum produto adicionado ainda. Clique em "Adicionar produto" para
        adicionar um.
      </p>
    </div>
  );
};

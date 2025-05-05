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

interface ProductsTableProps {
  productsFieldArray: UseFieldArrayReturn<CreateSaleSchema, "products">;
}

export const ProductsTable = ({ productsFieldArray }: ProductsTableProps) => {
  return productsFieldArray.fields.length ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Unidades</TableHead>
            <TableHead className="text-left">Preço de venda</TableHead>
            <TableHead className="text-left">Subtotal</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsFieldArray.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">{field.name}</TableCell>
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
                  onClick={() =>
                    productsFieldArray.remove(
                      productsFieldArray.fields.indexOf(field)
                    )
                  }
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
                productsFieldArray.fields.reduce(
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
    <div className="w-full px-5 py-20 flex items-center justify-center border border-dashed rounded-lg">
      <p className="text-center">
        Nenhum produto adicionado ainda. Clique em "Adicionar produto" para
        adicionar um.
      </p>
    </div>
  );
};

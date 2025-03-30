import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { TrashIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import { CreateProductSchema } from "../../../_utils/validations/create-product";

interface VariationsTableProps {
  variationsFieldArray: UseFieldArrayReturn<CreateProductSchema, "variations">;
}

export const VariationsTable = ({
  variationsFieldArray,
}: VariationsTableProps) => {
  return variationsFieldArray.fields.length ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Preço de venda</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variationsFieldArray.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{CurrencyFormatter.format(field.salePrice)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="p-0 size-9"
                  onClick={() =>
                    variationsFieldArray.remove(
                      variationsFieldArray.fields.indexOf(field)
                    )
                  }
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="w-full px-5 py-20 flex items-center justify-center border border-dashed rounded-lg">
      <p className="text-center">
        Nenhuma variação adicionada ainda. Clique em "Adicionar variação" para
        adicionar um.
      </p>
    </div>
  );
};

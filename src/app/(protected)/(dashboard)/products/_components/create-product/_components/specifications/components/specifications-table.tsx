import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import { CreateProductSchema } from "../../../_utils/validations/create-product";

interface SpecificationsTableProps {
  specificationsFieldArray: UseFieldArrayReturn<
    CreateProductSchema,
    "product.specifications"
  >;
}

export const SpecificationsTable = ({
  specificationsFieldArray,
}: SpecificationsTableProps) => {
  return specificationsFieldArray.fields.length ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Preço de venda</TableHead>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specificationsFieldArray.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.label}</TableCell>
              <TableCell>{field.value}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="p-0 size-9"
                  onClick={() =>
                    specificationsFieldArray.remove(
                      specificationsFieldArray.fields.indexOf(field)
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
      <p className="text-center text-sm text-muted-foreground">
        Nenhuma especificação adicionada ainda. Clique em "Adicionar
        especificação" para adicionar um.
      </p>
    </div>
  );
};

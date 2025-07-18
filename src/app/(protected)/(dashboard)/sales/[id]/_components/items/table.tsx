"use client";

import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CurrencyFormatter } from "@/utils/formatters/currency";
import moment from "moment";
import React, { FC, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  totalQty: number;
  salePrice: number;
  costPrice: number;
  stockLotUsages: Array<{
    lotNumber: string;
    quantity: number;
    costPrice: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

type TableItemsProps = {
  data: Product[];
};

export const TableItems: FC<TableItemsProps> = ({ data }) => {
  const total = useMemo(() => data.reduce(
    (sum, item) => sum + item.salePrice * item.totalQty, 0
  ), [data]);

  return (
    <div className="w-full border rounded-sm overflow-x-auto">
      <Accordion type="multiple" className="w-full">
        <TableCn className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">#</TableHead>
              <TableHead className="text-left">Nome</TableHead>
              <TableHead className="text-left">Preço de venda</TableHead>
              <TableHead className="text-left">Qntd</TableHead>
              <TableHead className="text-left">Custo total</TableHead>
              <TableHead className="text-left">Subtotal</TableHead>
              <TableHead className="text-left">Data de criação</TableHead>
              <TableHead className="text-left">Data de atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{CurrencyFormatter.format(item.salePrice)}</TableCell>
                  <TableCell>{item.totalQty}</TableCell>
                  <TableCell>{CurrencyFormatter.format(item.costPrice)}</TableCell>
                  <TableCell>{CurrencyFormatter.format(
                    item.totalQty * item.salePrice
                  )}</TableCell>
                  <TableCell>
                    {moment(item.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
                  </TableCell>
                  <TableCell>
                    {moment(item.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <AccordionItem value={item.id} className="m-2">
                      <AccordionTrigger className="h-5 p-0 gap-2 justify-normal cursor-pointer">
                        Lote(s)
                      </AccordionTrigger>

                      <AccordionContent className="flex flex-col p-0 mt-1">
                        {item.stockLotUsages.map(u => (
                          <div key={u.lotNumber} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span>{`${u.lotNumber}: `}</span>
                              <span>{`${u.quantity} unidade(s).`}</span>
                            </div>

                            <span>{`${CurrencyFormatter.format(u.costPrice)}/unidade.`}</span>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="text-right">
                {CurrencyFormatter.format(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </TableCn>
      </Accordion>
    </div>
  );
};

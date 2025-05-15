import { TableItems } from "./table";

type ItemsProps = {
  data: {
    id: string;
    name: string;
    totalQty: number;
    salePrice: number;
    costPrice: number;
    stockLot: {
      id: string;
      lotNumber: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const Items = ({ data }: ItemsProps) => {
  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Itens</h2>
      </div>
      <TableItems data={data} />
    </div>
  );
};

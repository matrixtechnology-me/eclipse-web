import { MovementsTable } from "./table";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";

interface MovementsProps {
  data: {
    id: string;
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export const Movements = ({ data }: MovementsProps) => {
  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Movimentações</h2>
      </div>
      <MovementsTable data={data} />
    </div>
  );
};

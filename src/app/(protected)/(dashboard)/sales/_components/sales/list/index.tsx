import { Sale } from "./sale";

type ListProps = {
  data: {
    id: string;
    costPrice: number;
    salePrice: number;
    totalItems: number;
    status: "completed" | "pending" | "canceled";
    customer: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  }[];
};

export const List = ({ data }: ListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
      {data.map((item) => (
        <Sale data={item} key={item.id} />
      ))}
    </div>
  );
};

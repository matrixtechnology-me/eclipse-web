import { FC } from "react";

type ItemsProps = {
  saleId: string;
};

export const Items: FC<ItemsProps> = async ({ saleId }) => {
  return <div>Items</div>;
};

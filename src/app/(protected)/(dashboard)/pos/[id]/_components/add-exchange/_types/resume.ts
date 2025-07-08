export type ExchangeResumeItemStatus =
  "kept" | "returned" | "new" | "incremented";

export type ExchangeResumeItem = {
  productId: string;
  name: string;
  salePrice: number;
  status: ExchangeResumeItemStatus;
  quantity: number;
};
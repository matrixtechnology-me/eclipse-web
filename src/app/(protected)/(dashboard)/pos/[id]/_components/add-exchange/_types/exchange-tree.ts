export type SharedProps = {
  name: string;
  children: string[];
  type: "root" | "selectable" | "inner";
};

export type RootTreeItem = SharedProps & {
  type: "root";
};

export type SelectableTreeItem = SharedProps & {
  saleItemId: string;
  quantity: number;
  stockLotUsages: {
    id: string;
    quantity: number;
  }[];
  type: "selectable";
};

export type InnerTreeItem = SharedProps & {
  productId: string;
  quantity: number;
  type: "inner";
};

export type ExchangeTreeItem =
  RootTreeItem | SelectableTreeItem | InnerTreeItem;
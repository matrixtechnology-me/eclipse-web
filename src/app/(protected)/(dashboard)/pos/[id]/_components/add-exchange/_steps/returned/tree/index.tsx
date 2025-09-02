import { FC, useEffect } from "react";
import {
  ItemInstance,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import {
  BoxIcon,
  MinusIcon,
  PackageIcon,
  PackageOpenIcon,
  PlusIcon,
} from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExchangeTreeItem } from "../../../_types/exchange-tree";

type Props = {
  items: Record<string, ExchangeTreeItem>;
};

const indent = 20;

function getIcon(item: ItemInstance<ExchangeTreeItem>) {
  const props = {
    className: "text-muted-foreground pointer-events-none size-5",
  };

  if (item.isFolder()) return item.isExpanded()
    ? <PackageOpenIcon {...props} />
    : <PackageIcon {...props} />;

  return <BoxIcon {...props} />;
};

export const ReturnedProductsTree: FC<Props> = ({ items }) => {
  const tree = useTree<ExchangeTreeItem>({
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId: string) => items[itemId],
      getChildren: (itemId: string) => items[itemId].children,
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
    ],
  });

  useEffect(() => {
    tree.rebuildTree();
  }, [items]);

  return (
    <div className="flex-1">
      <div className="flex h-full flex-col gap-2 *:first:grow">
        <div>
          <Tree
            className="relative before:absolute before:inset-0 before:ms-4.5 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
            indent={indent}
            tree={tree}
          >
            {tree.getItems().map((item) => (
              <TreeItemBody key={item.getId()} item={item} />
            ))}
          </Tree>
        </div>
      </div>
    </div>
  );
}

type TreeItemProps = {
  item: ItemInstance<ExchangeTreeItem>
};

const TreeItemBody: FC<TreeItemProps> = ({ item }) => {
  const data = item.getItemData();

  return (
    <div
      key={item.getId()}
      className="flex items-center gap-1.5 not-last:pb-0.5"
    >
      <TreeItem item={item} className="not-last:pb-0" asChild>
        <div className="flex-1 flex items-center">
          <TreeItemLabel className="w-full before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 hover:bg-accent/40 in-data-[selected=true]:bg-background min-h-10">
            <span className="flex items-center gap-2">
              {getIcon(item)}
              {item.getItemName()}

              {data.type == "selectable" && (
                <span className="text-muted-foreground">
                  Máx. de {data.quantity} unidade(s)
                </span>
              )}
            </span>

            {data.type == "inner" && (
              <span className="ml-2 flex items-center text-muted-foreground">
                {data.quantity} unidade(s)
              </span>
            )}
            {data.type == "selectable" && (
              <div
                className="ml-auto flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button type="button" variant="outline" className="size-8 p-0">
                  <PlusIcon />
                </Button>

                <NumericFormat
                  className="h-8 w-13 text-center"
                  value={0}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  fixedDecimalScale
                  allowNegative={false}
                  customInput={Input}
                  isAllowed={({ value }) => Number(value) <= data.quantity}
                />

                <Button type="button" variant="outline" className="size-8 p-0">
                  <MinusIcon />
                </Button>
              </div>
            )}
          </TreeItemLabel>
        </div>
      </TreeItem>
    </div>
  )
}
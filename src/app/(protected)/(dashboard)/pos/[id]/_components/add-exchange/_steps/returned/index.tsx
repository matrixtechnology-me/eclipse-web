import { FC, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../..";
import { Button } from "@/components/ui/button";
import React from "react"
import { Label } from "@/components/ui/label";
import { ReturnedProductsTree } from "./tree";
import { getSaleProductTrees, ProductTree } from "../../_actions/get-product-tree";
import {
  ExchangeTreeItem,
  InnerTreeItem,
  SelectableTreeItem,
} from "../../_types/exchange-tree";
import { Spin } from "@/components/spin";

type Props = {
  tenantId: string;
  onPrev: () => void;
  onContinue: () => void;
};

export const ExchangeReturnedFormStep: FC<Props> = ({
  tenantId,
  onPrev,
  onContinue,
}) => {
  const [validating, setValidating] = useState<boolean>(false);
  const [trees, setTrees] = useState<ProductTree[]>([]);

  function populateSubTree(
    prefix: string,
    subTree: ProductTree,
    data: Record<string, ExchangeTreeItem>,
  ) {
    const innerItemId = `${prefix}${subTree.productId}`;
    const subPrefix = `${innerItemId}-`;

    let payload: InnerTreeItem = {
      type: "inner",
      name: subTree.name,
      productId: subTree.productId,
      quantity: subTree.quantity,
      children: subTree.children.map(child => `${subPrefix}${child.productId}`),
    };

    data[innerItemId] = payload;

    for (const child of subTree.children) {
      populateSubTree(subPrefix, child, data);
    }
  };

  const items = useMemo(() => {
    const data: Record<string, ExchangeTreeItem> = {};
    if (trees.length < 1) return null;

    data["root"] = {
      type: "root",
      name: "Raíz",
      children: trees.map(treeRoot => {
        if (!treeRoot.root) throw new Error("Invalid tree root.");
        return treeRoot.saleProductId;
      }),
    };

    for (const treeRoot of trees) {
      if (!treeRoot.root) throw new Error("Invalid tree root.");

      const prefix = `${treeRoot.saleProductId}-`;

      const payload: SelectableTreeItem = {
        type: "selectable",
        saleItemId: treeRoot.saleProductId,
        name: treeRoot.name,
        quantity: treeRoot.quantity,
        stockLotUsages: treeRoot.stockLotUsages,
        children: treeRoot.children.map(child => `${prefix}${child.productId}`),
      };

      data[treeRoot.saleProductId] = payload;

      for (const child of treeRoot.children) {
        populateSubTree(prefix, child, data);
      }
    }

    return data;
  }, [trees]);

  const form = useFormContext<FormSchema>();
  const sale = useWatch({ name: "sale", control: form.control, });

  async function handleContinue() {
    setValidating(true);

    try {
      const formValidations = await Promise.all([
        // form.trigger("products.returned", { shouldFocus: true }),
        // form.trigger("products.replacement", { shouldFocus: true }),
      ]);

      if (formValidations.some(valid => !valid)) return;
      onContinue();

    } finally {
      setValidating(false);
    }
  }

  async function fetchRootTrees() {
    const rootTrees = await getSaleProductTrees(sale.id)
    setTrees(rootTrees);
  }

  useEffect(() => {
    if (sale?.id) fetchRootTrees();
  }, [sale?.id]);

  return (
    <div className="flex flex-col gap-3 flex-1">
      <Label className="text-md">
        Selecione os produtos devolvidos e suas quantidades.
      </Label>

      {!items ? (
        <div className="flex-1 flex items-center justify-center">
          <Spin className="text-white" />
        </div>
      ) : (
        <>
          <ReturnedProductsTree items={items} />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Voltar
            </Button>

            <Button type="button" disabled={validating} onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
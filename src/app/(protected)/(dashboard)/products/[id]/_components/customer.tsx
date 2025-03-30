"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../_actions/get-product";

type CustomerProps = {
  id: string;
};

export const Customer = ({ id }: CustomerProps) => {
  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const result = await getProduct({ id });

      if ("error" in result) return;

      const { product } = result.data;
      return product;
    },
  });

  if (!product) return <div>Produto não encontrado</div>;

  return <div>{product.name}</div>;
};

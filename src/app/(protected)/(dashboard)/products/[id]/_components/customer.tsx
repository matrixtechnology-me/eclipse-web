"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "../../_actions/get-product";

type CustomerProps = {
  id: string;
};

export const Customer = ({ id }: CustomerProps) => {
  const { data: customer } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const result = await getCustomer({ id });
      const { customer } = result.data;
      return customer;
    },
  });

  if (!customer) return <div>Cliente não encontrado</div>;

  return <div>{customer.name}</div>;
};

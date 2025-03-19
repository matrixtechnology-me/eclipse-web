"use client";

import { FC } from "react";
import { deleteCustomer } from "../_actions/delete-customer";
import { useRouter } from "next/navigation";

type DeleteCustomerProps = {
  id: string;
};

export const DeleteCustomer: FC<DeleteCustomerProps> = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteCustomer({ id });
    router.push("/customers");
  };

  return <button onClick={handleDelete}>Deletar</button>;
};

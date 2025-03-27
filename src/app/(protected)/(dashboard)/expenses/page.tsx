"use client";

import { NextPage } from "next";
import { createExpense } from "./_actions/create-expense";

const Page: NextPage = () => {
  const handleCreateExpense = async () => {
    await createExpense({
      amount: 39.9,
      description: "Pagamento para a conta de água",
      name: "Conta de água",
    });
  };

  return (
    <div>
      <button onClick={handleCreateExpense}>Criar</button>
    </div>
  );
};

export default Page;

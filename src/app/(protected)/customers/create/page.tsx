"use client";

import { useRouter } from "next/navigation";
import { createCustomer } from "../_actions/create-customer";

const Page = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await createCustomer(formData);
    router.push("/customers");
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="name" placeholder="Nome do cliente..." />
        <input name="email" placeholder="E-mail do cliente..." />
        <input name="address" placeholder="Endereço do cliente..." />
        <button>Criar</button>
      </form>
    </div>
  );
};

export default Page;

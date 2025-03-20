import { NextPage } from "next";
import { AuthenticationForm } from "./_components/authentication-form";

const Page: NextPage = () => {
  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-center gap-5">
      <div className="w-full max-w-sm">
        <h1 className="font-bold">
          Acesse sua conta e gerencie com facilidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Entre para acompanhar seus clientes, controlar empréstimos e manter
          suas finanças sempre organizadas.
        </p>
      </div>
      <AuthenticationForm />
    </div>
  );
};

export default Page;

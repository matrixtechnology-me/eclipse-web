import { NextPage } from "next";
import { AuthenticationForm } from "./_components/authentication-form";
import { EclipseIcon } from "lucide-react";

const Page: NextPage = () => {
  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-center ">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="size-9 flex items-center justify-center border rounded-md bg-primary">
            <EclipseIcon className="size-4 text-primary-foreground" />
          </div>
          <div className="w-full max-w-sm">
            <h1 className="font-bold">
              Acesse sua conta e gerencie com facilidade
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre para acompanhar seus clientes, controlar empréstimos e
              manter suas finanças sempre organizadas.
            </p>
          </div>
        </div>
        <AuthenticationForm />
        <div className="">
          <p className="text-sm text-muted-foreground text-center">
            Ao assinar você concorda com os <strong>Termos de Uso</strong> e{" "}
            <strong>Política de Privacidade</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

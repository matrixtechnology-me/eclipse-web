import { NextPage } from "next";
import { FirstAccessForm } from "./_components/first-acess-form";
import { EclipseIcon } from "lucide-react";
import { Countdown } from "./_components/countdown";

const Page: NextPage = () => {
  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-center px-5 md:px-0">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="size-9 flex items-center justify-center border rounded-md bg-primary">
            <EclipseIcon className="size-4 text-primary-foreground" />
          </div>
          <div className="w-full max-w-sm">
            <h1 className="font-bold text-lg">Defina sua nova senha</h1>
            <p className="text-sm text-muted-foreground">
              Este é seu primeiro acesso. Crie uma senha segura para começar a
              usar sua conta.
            </p>
          </div>
        </div>
        <Countdown initialTime={300} />
        <FirstAccessForm />
        <div className="">
          <p className="text-sm text-muted-foreground text-center">
            Ao continuar, você concorda com os <strong>Termos de Uso</strong> e{" "}
            <strong>Política de Privacidade</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

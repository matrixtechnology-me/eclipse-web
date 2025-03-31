import { NextPage } from "next";
import { EclipseIcon } from "lucide-react";
import { RegistrationForm } from "./_components/registration-form";

const Page: NextPage = () => {
  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-center px-5 md:px-0">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="size-9 flex items-center justify-center border rounded-md bg-primary">
            <EclipseIcon className="size-4 text-primary-foreground" />
          </div>
          <div className="w-full max-w-sm">
            <h1 className="font-bold">Crie sua conta e comece a gerenciar</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre-se e assuma o controle do seu negócio com nossa
              plataforma de gestão inteligente."
            </p>
          </div>
        </div>
        <RegistrationForm />
        <div className="">
          <p className="text-sm text-muted-foreground text-center">
            Já possui uma conta?{" "}
            <a href="/login" className="text-primary underline">
              Faça login aqui
            </a>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Ao se cadastrar você concorda com nossos{" "}
            <strong>Termos de Serviço</strong> e{" "}
            <strong>Política de Privacidade</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

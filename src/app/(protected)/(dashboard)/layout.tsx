import { FC, Suspense } from "react";
import { getServerSession } from "../../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";
import { Header } from "./_components/header";
import { Content } from "./_components/content";
import { Sidebar } from "./_components/sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) redirect(PATHS.PUBLIC.AUTH.SIGN_IN);

  return (
    <>
      <div className="hidden md:flex w-screen h-screen overflow-hidden flex-row ">
        <Sidebar />
        <div className="w-full flex flex-col items-center">
          <Header
            tenantId={session.tenantId}
            userId={session.id}
            doNotDisturb={session.settings.doNotDisturb}
          />
          <Content>
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full">
                  <span>Carregando...</span>
                </div>
              }
            >
              {children}
            </Suspense>
          </Content>
        </div>
      </div>

      <div className="md:hidden w-screen h-screen flex flex-col justify-center items-center px-6 text-centertext-muted-foreground">
        <h1 className="text-xl font-semibold mb-2">Sem suporte para mobile</h1>
        <p className="text-sm">
          Este aplicativo ainda não está disponível para dispositivos móveis.
          Acesse por um computador ou tablet para usar todas as funcionalidades.
        </p>
      </div>
    </>
  );
};

export default Layout;

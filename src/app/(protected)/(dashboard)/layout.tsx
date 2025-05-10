import { FC, Suspense } from "react";
import { getServerSession } from "../../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";
import { Header } from "./_components/header";
import { Content } from "./_components/content";

type LayoutParams = {
  "tenant-id": string;
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
};

const Layout: FC<LayoutProps> = async ({ children, params }) => {
  const { "tenant-id": tenantId } = await params;

  const session = await getServerSession();

  if (!session) redirect(PATHS.PUBLIC.AUTH.SIGN_IN);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header tenantId={tenantId} userId={session.id} />
      <Content>
        <Suspense
          fallback={
            <div>
              <span>Carregando...</span>
            </div>
          }
        >
          {children}
        </Suspense>
      </Content>
    </div>
  );
};

export default Layout;

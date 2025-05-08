import { FC } from "react";
import { getServerSession } from "../../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";
import { Header } from "./_components/header";
import { Content } from "./_components/content";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (!session) redirect(PATHS.PUBLIC.AUTH.SIGN_IN);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header tenantId={session.tenantId} userId={session.id} />
      <Content>{children}</Content>
    </div>
  );
};

export default Layout;

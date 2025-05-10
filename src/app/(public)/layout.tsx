import { FC } from "react";
import { getServerSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (session) redirect(PATHS.PROTECTED.DASHBOARD(session.tenantId).HOMEPAGE);

  return <>{children}</>;
};

export default Layout;

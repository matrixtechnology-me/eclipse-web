import { FC } from "react";
import { Account } from "./account";
import { Menu } from "./menu";
import { Notifications } from "./notifications";
import { TenantSwicther } from "./tenant-swicther";

type HeaderProps = {
  tenantId: string;
  userId: string;
  doNotDisturb: boolean;
};

export const Header: FC<HeaderProps> = ({ tenantId, userId, doNotDisturb }) => {
  return (
    <div className="w-screen h-16 border-b px-5 lg:px-0">
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-between">
        <Menu tenantId={tenantId} />
        <div className="flex gap-2">
          <TenantSwicther />
          <Notifications
            tenantId={tenantId}
            userId={userId}
            doNotDisturb={doNotDisturb}
          />
          <Account />
        </div>
      </div>
    </div>
  );
};

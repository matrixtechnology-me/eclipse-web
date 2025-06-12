import { FC } from "react";
import { Account } from "./account";
import { Notifications } from "./notifications";
import { TenantSwicther } from "./tenant-swicther";

type HeaderProps = {
  tenantId: string;
  userId: string;
  doNotDisturb: boolean;
};

export const Header: FC<HeaderProps> = ({ tenantId, userId, doNotDisturb }) => {
  return (
    <div className="w-full h-16 border-b px-5 flex items-center justify-between">
      <TenantSwicther />
      <div className="flex gap-2">
        <Notifications
          tenantId={tenantId}
          userId={userId}
          doNotDisturb={doNotDisturb}
        />
        <Account />
      </div>
    </div>
  );
};

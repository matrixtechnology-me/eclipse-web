"use client";

import { Tenant } from "@/app/(protected)/_actions/get-user-tenants";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATHS } from "@/config/paths";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { FC } from "react";

type SelectTenantProps = {
  tenants: Tenant[];
  tenantId: string;
};

export const SelectTenant: FC<SelectTenantProps> = ({ tenants, tenantId }) => {
  const router = useRouter();

  const handleSelectTenant = (tenantId: string) => {
    setCookie(null, "X-Tenant", tenantId, { path: "/" });
    router.push(PATHS.PROTECTED.DASHBOARD.HOMEPAGE);
  };

  return (
    <Select
      defaultValue={tenantId}
      onValueChange={(value) => {
        if (value === "new-tenant") {
          return router.push(PATHS.PROTECTED.GET_STARTED);
        }

        handleSelectTenant(value);
      }}
    >
      <SelectTrigger className="w-fit max-w-3xs rounded-sm pl-5">
        <SelectValue placeholder="Selecione um negócio" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((tenant) => (
          <SelectItem key={tenant.id} value={tenant.id}>
            {tenant.name}
            <Badge variant="secondary" className="rounded-xs">
              <span className="text-xs">Starter</span>
            </Badge>
          </SelectItem>
        ))}
        <SelectItem value="new-tenant">
          <PlusIcon className="size-4" />
          Novo negócio
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

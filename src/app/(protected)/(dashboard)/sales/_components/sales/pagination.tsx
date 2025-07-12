"use client";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, RefreshCcwIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { PATHS } from "@/config/paths";
import { useRouter } from "next/navigation";

type PaginationProps = {
  tenantId: string;
  initialPage: number;
  initialPageSize: number;
};

export const Pagination: FC<PaginationProps> = ({
  initialPage,
  initialPageSize,
  tenantId,
}) => {
  const router = useRouter();

  const mountUrl = (page: number, limit: number) => {
    return () =>
      router.push(
        PATHS.PROTECTED.DASHBOARD.SALES.INDEX({
          page: String(page),
          limit: String(limit),
        })
      );
  };

  return (
    <div className="h-16 border-t lg:border-none flex items-center justify-between px-5 mt-4">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={mountUrl(initialPage, initialPageSize)}
        >
          <RefreshCcwIcon className="size-4" />
        </Button>
        <Select
          defaultValue={String(initialPageSize)}
          onValueChange={(value) => mountUrl(initialPage, Number(value))()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 itens</SelectItem>
            <SelectItem value="10">10 itens</SelectItem>
            <SelectItem value="15">15 itens</SelectItem>
            <SelectItem value="20">20 itens</SelectItem>
            <SelectItem value="25">25 itens</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={mountUrl(initialPage - 1, initialPageSize)}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={mountUrl(initialPage + 1, initialPageSize)}
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

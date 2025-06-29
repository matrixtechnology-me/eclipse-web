"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { revalidateTag } from "next/cache";

type Params = {
  tenantId: string;
  posId: string;
}

export const revalidate = async ({ posId, tenantId }: Params) => {
  // Pos
  revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);
  // Pos list
  revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.INDEX.ALL);
  // Sales list
  revalidateTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);
  // TODO: revalidate Sale when tagged.
}
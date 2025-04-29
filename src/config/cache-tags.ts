export const CACHE_TAGS = {
  USER: (userId: string) => {},
  TENANT: (tenantId: string) => ({
    STOCKS: {
      INDEX: `tenant-[${tenantId}].stocks`,
      STOCK: (stockId: string) => ({
        EVENTS: `tenant-[${tenantId}].stock-[${stockId}].events`,
        LOTS: `tenant-[${tenantId}].stock-[${stockId}].lots`,
      }),
    },
  }),
};

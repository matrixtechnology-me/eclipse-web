export const CACHE_TAGS = {
  USER: (userId: string) => {},
  TENANT: (tenantId: string) => ({
    CUSTOMERS: {
      INDEX: `tenant-[${tenantId}].customers`,
      CUSTOMER: (customerId: string) => ({
        INDEX: `tenant-[${tenantId}].customer-[${customerId}]`,
        EVENTS: `tenant-[${tenantId}].customer-[${customerId}].events`,
        LOTS: `tenant-[${tenantId}].customer-[${customerId}].lots`,
      }),
    },
    STOCKS: {
      INDEX: `tenant-[${tenantId}].stocks`,
      STOCK: (stockId: string) => ({
        EVENTS: `tenant-[${tenantId}].stock-[${stockId}].events`,
        LOTS: `tenant-[${tenantId}].stock-[${stockId}].lots`,
      }),
    },
  }),
};

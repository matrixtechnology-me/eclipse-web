export const CACHE_TAGS = {
  USER_TENANT: (userId: string, tenantId: string) => ({
    NOTIFICATIONS: `user_tenant-[${userId},${tenantId}].notifications`,
  }),
  USER: (userId: string) => ({
    TENANTS: `user-[${userId}].tenants`,
  }),
  TENANT: (tenantId: string) => ({
    CUSTOMERS: {
      INDEX: `tenant-[${tenantId}].customers`,
      CUSTOMER: (customerId: string) => ({
        INDEX: `tenant-[${tenantId}].customer-[${customerId}]`,
        EVENTS: `tenant-[${tenantId}].customer-[${customerId}].events`,
        LOTS: `tenant-[${tenantId}].customer-[${customerId}].lots`,
      }),
    },
    PRODUCTS: {
      INDEX: `tenant-[${tenantId}].products`,
      PRODUCT: (productId: string) => ({
        INDEX: `tenant-[${tenantId}].product-[${productId}]`,
        SPECIFICATIONS: `tenant-[${tenantId}].product-[${productId}].specifications`,
      }),
    },
    STOCKS: {
      INDEX: `tenant-[${tenantId}].stocks`,
      STOCK: (stockId: string) => ({
        INDEX: `tenant-[${tenantId}].stock-[${stockId}]`,
        EVENTS: `tenant-[${tenantId}].stock-[${stockId}].events`,
        LOTS: `tenant-[${tenantId}].stock-[${stockId}].lots`,
      }),
    },
    POS: {
      INDEX: `tenant-[${tenantId}].points_of_sale`,
      POS: (posId: string) => ({
        INDEX: `tenant-[${tenantId}].point_of_sale-[${posId}]`,
      }),
    },
  }),
};

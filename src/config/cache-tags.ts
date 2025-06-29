export const CACHE_TAGS = {
  USER_TENANT: (userId: string, tenantId: string) => ({
    NOTIFICATIONS: `user_tenant-[${userId},${tenantId}].notifications`,
  }),
  USER: (userId: string) => ({
    TENANTS: `user-[${userId}].tenants`,
  }),
  TENANT: (tenantId: string) => ({
    CUSTOMERS: {
      INDEX: {
        ALL: `tenant-[${tenantId}].customers`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].customers?page=${page}&limit=${limit}`,
      },
      CUSTOMER: (customerId: string) => ({
        INDEX: `tenant-[${tenantId}].customer-[${customerId}]`,
        EVENTS: `tenant-[${tenantId}].customer-[${customerId}].events`,
        LOTS: `tenant-[${tenantId}].customer-[${customerId}].lots`,
      }),
    },
    PRODUCTS: {
      INDEX: {
        ALL: `tenant-[${tenantId}].products`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].products?page=${page}&limit=${limit}`,
      },
      CATEGORIES: {
        INDEX: {
          ALL: `tenant-[${tenantId}].products.categories`,
          PAGINATED: (page: number, limit: number) =>
            `tenant-[${tenantId}].products.categories?page=${page}&limit=${limit}`,
        },
      },
      SUBCATEGORIES: {
        INDEX: {
          ALL: `tenant-[${tenantId}].products.subcategories`,
          PAGINATED: (page: number, limit: number) =>
            `tenant-[${tenantId}].products.subcategories?page=${page}&limit=${limit}`,
        },
      },
      PRODUCT: (productId: string) => ({
        INDEX: `tenant-[${tenantId}].product-[${productId}]`,
        SPECIFICATIONS: `tenant-[${tenantId}].product-[${productId}].specifications`,
        COMPOSITIONS: `tenant-[${tenantId}].product-[${productId}].compositions`,
      }),
    },
    STOCKS: {
      INDEX: {
        ALL: `tenant-[${tenantId}].stocks`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].stocks?page=${page}&limit=${limit}`,
      },
      STOCK: (stockId: string) => ({
        INDEX: `tenant-[${tenantId}].stock-[${stockId}]`,
        EVENTS: `tenant-[${tenantId}].stock-[${stockId}].events`,
        LOTS: `tenant-[${tenantId}].stock-[${stockId}].lots`,
      }),
    },
    POS: {
      INDEX: {
        ALL: `tenant-[${tenantId}].pos`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].pos?page=${page}&limit=${limit}`,
      },
      POS: (posId: string) => ({
        INDEX: `tenant-[${tenantId}].pos-[${posId}]`,
      }),
    },
    SALES: {
      INDEX: {
        ALL: `tenant-[${tenantId}].sales`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].sales?page=${page}&limit=${limit}`,
      },
      SALE: (saleId: string) => ({
        INDEX: `tenant-[${tenantId}].sale-[${saleId}]`,
      }),
      FROM_CUSTOMER: (customerId: string) => ({
        ALL: `tenant-[${tenantId}].customer-[${customerId}].sales`,
        PAGINATED: (page: number, limit: number) =>
          `tenant-[${tenantId}].customer-[${customerId}].sales?page=${page}&limit=${limit}`,
      }),
    },
  }),
};

import { generateQueryParams } from "@/utils/query";

export const PATHS = {
  PUBLIC: {
    AUTH: {
      SIGN_IN: "/auth/sign-in",
    },
  },
  PROTECTED: {
    GET_STARTED: "/get-started",
    DASHBOARD: {
      HOMEPAGE: "/",
      CUSTOMERS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/customers${queryParams}`;
        },
        CREATE: "/customers/create",
        CUSTOMER: (customerId: string) => `/customers/${customerId}`,
        EDIT: (customerId: string) => `/customers/${customerId}/update`,
      },
      PRODUCTS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/products${queryParams}`;
        },
        CREATE: "/products/create",
        PRODUCT: (productId: string) => ({
          INDEX: `/products/${productId}`,
          VARIATION: (skuCode: string) =>
            `/products/${productId}/variations/${skuCode}`,
        }),
      },
      POS: {
        INDEX: "/pos",
        POS: (id: string) => ({
          INDEX: `/pos/${id}`,
        }),
      },
      TABLES: {
        INDEX: "/tables",
      },
      DELIVERIES: {
        INDEX: "/deliveries",
      },
      BILLS: {
        INDEX: "/bills",
      },
      REPORTS: {
        INDEX: "/reports",
      },
      STOCKS: {
        INDEX: "/stocks",
        STOCK: (id: string) => ({
          INDEX: `/stocks/${id}`,
        }),
      },
      ADJUSTMENTS: {
        INDEX: "/adjustments",
      },
      SALES: {
        INDEX: "/sales",
        CREATE: "/sales/create",
        SALE: (saleId: string) => ({
          INDEX: `/sales/${saleId}`,
        }),
      },
    },
  },
};

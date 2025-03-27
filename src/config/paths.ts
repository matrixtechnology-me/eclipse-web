import { generateQueryParams } from "@/utils/query";

export const PATHS = {
  PUBLIC: {
    AUTH: {
      SIGN_IN: "/auth/sign-in",
    },
  },
  PROTECTED: {
    HOMEPAGE: "/",
    CUSTOMERS: {
      INDEX: (params?: Record<string, string | undefined>) => {
        const queryParams = generateQueryParams({ ...params });
        return `/customers${queryParams}`;
      },
      CUSTOMER: (customerId: string) => `/customers/${customerId}`,
    },
    PRODUCTS: {
      INDEX: "/products",
      CREATE: "/products/create",
    },
    SALES: {
      INDEX: "/sales",
      CREATE: "/sales/create",
    },
    RECEIVABLES: {
      INDEX: "/receivables",
    },
    PAYABLES: {
      INDEX: "/payables",
    },
  },
};

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
        CUSTOMER: (customerId: string) => `/customers/${customerId}`,
      },
      PRODUCTS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/products${queryParams}`;
        },
        PRODUCT: (productId: string) => ({
          INDEX: `/products/${productId}`,
          VARIATION: (skuCode: string) =>
            `/products/${productId}/variations/${skuCode}`,
        }),
      },
      POS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/pos${queryParams}`;
        },
        POS: (id: string) => ({
          INDEX: `/pos/${id}`,
        }),
      },
      STOCKS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/stocks${queryParams}`;
        },
        STOCK: (id: string) => ({
          INDEX: `/stocks/${id}`,
        }),
      },
      REPORTS: {
        INDEX: "/reports",
      },
      SALES: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/sales${queryParams}`;
        },
        CREATE: "/sales/create",
        SALE: (saleId: string) => ({
          INDEX: `/sales/${saleId}`,
        }),
      },
    },
  },
};

type PathObject = { [key: string]: string | PathObject };

const extractPaths = (obj: PathObject): string[] => {
  const paths: string[] = [];

  for (const value of Object.values(obj)) {
    if (typeof value === "string") {
      paths.push(value);
    } else if (typeof value === "object" && value !== null) {
      paths.push(...extractPaths(value));
    }
  }

  return paths;
};

export const publicPaths = extractPaths(PATHS.PUBLIC);

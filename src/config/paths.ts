import { generateQueryParams } from "@/utils/query";

export const PATHS = {
  PUBLIC: {
    AUTH: {
      SIGN_IN: "/auth/sign-in",
      FIRST_ACCESS: "/auth/first-access",
    },
  },
  PROTECTED: {
    GET_STARTED: "/get-started",
    DASHBOARD: (tenantId: string) => ({
      HOMEPAGE: `/${tenantId}`,
      CUSTOMERS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/${tenantId}/customers${queryParams}`;
        },
        CUSTOMER: (customerId: string) =>
          `/${tenantId}/customers/${customerId}`,
      },
      PRODUCTS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/${tenantId}/products${queryParams}`;
        },
        PRODUCT: (productId: string) => ({
          INDEX: `/${tenantId}/products/${productId}`,
          VARIATION: (skuCode: string) =>
            `/${tenantId}/products/${productId}/variations/${skuCode}`,
        }),
      },
      POS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/${tenantId}/pos${queryParams}`;
        },
        POS: (id: string) => ({
          INDEX: `/${tenantId}/pos/${id}`,
        }),
      },
      STOCKS: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/${tenantId}/stocks${queryParams}`;
        },
        STOCK: (id: string) => ({
          INDEX: `/${tenantId}/stocks/${id}`,
        }),
      },
      REPORTS: {
        INDEX: `/${tenantId}/reports`,
      },
      SALES: {
        INDEX: (params?: Record<string, string | undefined>) => {
          const queryParams = generateQueryParams({ ...params });
          return `/${tenantId}/sales${queryParams}`;
        },
        CREATE: `/${tenantId}/sales/create`,
        SALE: (saleId: string) => ({
          INDEX: `/${tenantId}/sales/${saleId}`,
        }),
      },
    }),
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

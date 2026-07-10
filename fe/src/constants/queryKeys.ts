import { GetProductsParams } from "@/types/product";

export const QUERY_KEYS = {
  sample: {
    all: () => ["sample"] as const,
    list: () => [...QUERY_KEYS.sample.all(), "list"] as const,
    detail: (id: number) => [...QUERY_KEYS.sample.all(), "detail", id] as const,
  },
  products: {
    all: () => ["products"] as const,
    list: (params?: GetProductsParams) =>
      [...QUERY_KEYS.products.all(), "list", params] as const,
    detail: (id: number) => [...QUERY_KEYS.products.all(), "detail", id] as const,
  },
};

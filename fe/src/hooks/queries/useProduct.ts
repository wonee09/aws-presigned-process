import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product";
import { GetProductsParams, CreateProductRequest } from "@/types/product";

export const useProducts = (params?: GetProductsParams) =>
  useQuery({
    queryKey: QUERY_KEYS.products.list(params),
    queryFn: () => getProducts(params),
  });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateProductRequest>;
    }) => updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all() });
    },
  });
};

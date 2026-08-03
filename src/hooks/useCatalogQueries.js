import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

/**
 * Hook TanStack Query pour récupérer la liste des produits avec cache client (5 minutes)
 */
export function useProductsQuery(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productService.getAll(params);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes en cache actif
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook TanStack Query pour récupérer les catégories avec cache client (10 minutes)
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoryService.getAll();
      return data.data || data.categories || [];
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook TanStack Query pour récupérer le détail d'un produit par ID
 */
export function useProductDetailQuery(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await productService.getById(id);
      return data.data || data.product || data;
    },
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Hook TanStack Query pour les ventes flash (promotions actives)
 */
export function useFlashSalesQuery() {
  return useQuery({
    queryKey: ['products', { discount: 'true' }],
    queryFn: async () => {
      const { data } = await productService.getAll({ discount: 'true' });
      return data.data || data.products || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

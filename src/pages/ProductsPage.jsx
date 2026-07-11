import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

export default function ProductsPage({ basePath = '/products' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || searchParams.get('q') || '',
    category_id: searchParams.get('category_id') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const debouncedSearch = useDebounce(filters.search);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        per_page: 12,
        sort: filters.sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;

      const { data } = await productService.getAll(params);
      setProducts(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.sort, filters.category_id, filters.min_price, filters.max_price, debouncedSearch]);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => {
      setCategories(data.data || data || []);
    });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price) params.set('max_price', filters.max_price);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.page > 1) params.set('page', String(filters.page));
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Catalogue produits</h1>
      <ProductFilters filters={filters} categories={categories} onChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="Aucun produit trouvé" description="Essayez de modifier vos filtres." />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} basePath={basePath} />
            ))}
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}

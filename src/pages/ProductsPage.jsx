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
    in_stock: searchParams.get('in_stock') === 'true',
    on_sale: searchParams.get('on_sale') === 'true',
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
      if (filters.in_stock) params.in_stock = 'true';
      if (filters.on_sale) params.discount = 'true';

      const { data } = await productService.getAll(params);
      let list = data.data || [];
      if (filters.in_stock) {
        list = list.filter((p) => p.stock > 0 || p.in_stock !== false);
      }
      if (filters.on_sale) {
        list = list.filter((p) => p.is_on_sale || p.old_price > p.price);
      }
      setProducts(list);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.sort, filters.category_id, filters.min_price, filters.max_price, filters.in_stock, filters.on_sale, debouncedSearch]);

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
    if (filters.in_stock) params.set('in_stock', 'true');
    if (filters.on_sale) params.set('on_sale', 'true');
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.page > 1) params.set('page', String(filters.page));
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 0 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
          background: '#e0e7ff', color: '#4f46e5', marginBottom: 12
        }}>
          ✦ Explorez l&apos;univers Soukna
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Catalogue Produits
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 15, color: '#64748b' }}>
              Découvrez notre sélection complète de produits authentiques et vérifiés
            </p>
          </div>
          {pagination && (
            <span style={{ fontSize: 14, fontWeight: 700, color: '#475569', background: 'white', padding: '8px 16px', borderRadius: 99, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              {pagination.total || products.length} article{(pagination.total || products.length) > 1 ? 's' : ''} disponible{(pagination.total || products.length) > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div style={{ marginBottom: 36 }}>
        <ProductFilters filters={filters} categories={categories} onChange={handleFilterChange} />
      </div>

      {/* Grid Produits */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div style={{ margin: '40px 0' }}>
          <EmptyState title="Aucun produit trouvé" description="Essayez d&apos;ajuster vos critères de recherche ou vos filtres de prix." />
        </div>
      ) : (
        <>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24, marginBottom: 40 }}>
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

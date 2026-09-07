import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../services/searchService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(q);
  const [searchType, setSearchType] = useState(type);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchService
      .search({ q, type: searchType })
      .then(({ data }) => setResults(data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [q, searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim(), type: searchType });
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Recherche</h1>

      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="all">Tout</option>
          <option value="products">Produits</option>
          <option value="sellers">Vendeurs</option>
          <option value="categories">Catégories</option>
        </select>
        <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer transition">
          <Search size={15} />
          <span>Rechercher</span>
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!loading && results && (
        <div className="space-y-8">
          {results.products?.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Produits ({results.products.length})</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {results.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {results.sellers?.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Vendeurs ({results.sellers.length})</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {results.sellers.map((s) => (
                  <Link
                    key={s.id}
                    to={`/buyer/messages?user=${s.id}`}
                    className="rounded-lg border border-slate-200 bg-white p-4 hover:border-indigo-300"
                  >
                    <p className="font-medium">{s.name}</p>
                    {s.city && <p className="text-sm text-slate-500">{s.city}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.categories?.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Catégories ({results.categories.length})</h2>
              <div className="flex flex-wrap gap-3">
                {results.categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/products?category_id=${c.id}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-indigo-300"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!results.products?.length && !results.sellers?.length && !results.categories?.length && q && (
            <p className="text-slate-500">Aucun résultat pour « {q} ».</p>
          )}
        </div>
      )}
    </div>
  );
}

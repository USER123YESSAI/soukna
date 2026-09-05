import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const params = sort !== 'newest' ? { sort } : {};
    favoriteService
      .getAll(params)
      .then(({ data }) => setFavorites(data.data || data.favorites || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [sort]);

  const sorted = [...favorites].sort((a, b) => {
    const pa = parseFloat((a.product ?? a)?.effective_price ?? (a.product ?? a)?.price ?? 0);
    const pb = parseFloat((b.product ?? b)?.effective_price ?? (b.product ?? b)?.price ?? 0);
    if (sort === 'price_low_to_high') return pa - pb;
    if (sort === 'price_high_to_low') return pb - pa;
    return 0;
  });

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div>
      <PageHeader
        title="Mes favoris"
        subtitle={`${favorites.length} article${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''} dans votre liste de souhaits`}
        actions={
          <div className="w-48">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Plus récents</option>
              <option value="price_low_to_high">Prix croissant</option>
              <option value="price_high_to_low">Prix décroissant</option>
            </Select>
          </div>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="Votre liste de favoris est vide"
          description="Explorez les articles du catalogue et cliquez sur le cœur pour les retrouver en un clic."
          action={
            <Button to="/products" variant="primary" size="md">
              Découvrir les produits →
            </Button>
          }
        />
      ) : (
        <div className="responsive-grid">
          {sorted.map((item) => (
            <ProductCard key={item.id || item.product?.id} product={item.product || item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return <FavoritesList />;
}

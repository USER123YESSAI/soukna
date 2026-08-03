import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDate, getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductImage from '../components/ui/ProductImage';
import InlineChat from '../components/messages/InlineChat';
import ProductSeoSchema from '../components/seo/ProductSeoSchema';
import ProductReviews from '../components/products/ProductReviews';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function ProductDetailPage({ basePath = '/products' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getById(id);
        setProduct(data);
        if (isAuthenticated) {
          const favRes = await productService.isFavorite(id);
          setIsFavorite(favRes.data.is_favorite);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
        setIsFavorite(false);
        toast.success('Retiré des favoris');
      } else {
        await favoriteService.add(parseInt(id, 10));
        setIsFavorite(true);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter au panier');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(parseInt(id, 10), quantity);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour acheter');
      return;
    }
    setAdding(true);
    try {
      await addToCart(parseInt(id, 10), quantity);
      window.location.href = '/checkout';
    } catch (error) {
      setAdding(false);
      toast.error(getErrorMessage(error));
    }
  };

  const onSubmitReview = async (data) => {
    try {
      await productService.addReview(id, data);
      toast.success('Avis publié');
      reset();
      const { data: refreshed } = await productService.getById(id);
      setProduct(refreshed);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-slate-500">Produit introuvable.</p>;
  }

  const price = product.effective_price ?? product.price;
  const canContactSeller = isAuthenticated && product.seller && product.seller.id !== user?.id;

  return (
    <div>
      <ProductSeoSchema product={product} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white">
          {product.image ? (
            <ProductImage src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }} />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-slate-100 text-slate-400">
              Sans image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>
          {product.category && (
            <Link
              to={`${basePath}?category_id=${product.category.id}`}
              className="mt-1 inline-block text-sm text-indigo-600 hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">{formatPrice(price)}</span>
            {product.is_on_sale && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Notation & Avis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <a href="#reviews-section" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', background: '#fef3c7', padding: '4px 12px', borderRadius: 99, border: '1px solid #fde68a' }}>
              <span style={{ color: '#d97706', fontSize: 14, fontWeight: 800 }}>★</span>
              <span style={{ fontWeight: 800, color: '#92400e', fontSize: 13 }}>
                {product.rating && parseFloat(product.rating) > 0 ? parseFloat(product.rating).toFixed(1) : '5.0'}
              </span>
              <span style={{ color: '#b45309', fontSize: 12 }}>
                ({product.total_reviews || product.reviews?.length || 0} avis)
              </span>
            </a>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>📦 En stock : {product.quantity}</span>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>👁️ {product.views} vues</span>
          </div>

          {/* Section des boutons d'action */}
          {isAuthenticated && user?.role === 'buyer' && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm"
                />
                <span className="text-sm text-slate-500">{product.quantity} disponible</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || product.quantity < 1}
                  className="flex-1 min-w-[200px] rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {adding ? 'Ajout...' : '🛒 Ajouter au panier'}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={adding || product.quantity < 1}
                  className="flex-1 min-w-[200px] rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {adding ? 'Préparation...' : '⚡ Acheter maintenant'}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={`flex-1 min-w-[200px] rounded-lg border px-6 py-3 text-sm font-medium transition-colors ${
                    isFavorite
                      ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isFavorite ? '❤️ Favori' : '🤍 Ajouter aux favoris'}
                </button>
                {canContactSeller && (
                  <button
                    type="button"
                    onClick={() => setShowChat(!showChat)}
                    className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    💬 Contacter le vendeur
                  </button>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                  Connectez-vous
                </Link>
                {' '}pour acheter ce produit
              </p>
            </div>
          )}

          {/* Chat inline avec le vendeur */}
          {showChat && canContactSeller && (
            <div style={{ marginTop: 12 }}>
              <InlineChat
                recipientId={product.seller.id}
                recipientName={product.seller.name}
                title={`Discussion avec ${product.seller.name}`}
                maxHeight={300}
              />
            </div>
          )}

          <p className="mt-6 text-slate-600">{product.description}</p>

          {product.seller && (
            <div className="mt-6 rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Informations vendeur</p>
              <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>{product.seller.name}</p>
              {product.seller.city && <p className="text-sm text-slate-500">{product.seller.city}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Section Notation & Avis acheteurs vérifiés */}
      <ProductReviews productId={product.id} />
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../services/api';
import ProductImage from '../ui/ProductImage';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Star, ShoppingCart } from 'lucide-react';


export default function ProductCard({ product, basePath = '/products', isFlashSale = false, priority = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [favorite, setFavorite] = useState(false);
  const [adding, setAdding] = useState(false);

  const price = product.effective_price ?? product.price ?? 0;
  // Un prix barré n'est affiché que s'il existe un original_price > price.
  // En section Vente Flash, si le backend n'a pas fourni original_price, on simule un ancien prix crédible (+35%) pour éviter de barrer le même prix.
  const oldPrice = product.original_price && product.original_price > price
    ? product.original_price
    : isFlashSale
    ? Math.round(price * 1.35)
    : null;

  const hasDiscount = Boolean(oldPrice && oldPrice > price);

  // Calcul du pourcentage de réduction (ex: -25%, -40%)
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  // Calcul des ventes pour la barre de progression (ventes flash uniquement)
  const soldCount = product.sales_count || ((product.id || 1) * 17) % 85 + 15;
  const totalStock = Math.max(soldCount + 20, 100);
  const soldPercent = Math.min(Math.round((soldCount / totalStock) * 100), 95);

  // Badges (Promo, Bestseller ou Nouveau)
  const isBestseller = !hasDiscount && (product.sales_count >= 50 || (product.id || 1) % 3 === 0);
  const isNew = !hasDiscount && !isBestseller;

  // Notation et avis
  const displayRating = product.rating
    ? parseFloat(product.rating).toFixed(1)
    : (4 + ((product.id || 1) % 9) / 10).toFixed(1);
  const displayReviews = product.total_reviews || ((product.id || 1) * 13) % 90 + 12;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter un produit au panier.');
      navigate('/login');
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch {
      // toast erreur géré par CartContext
    } finally {
      setAdding(false);
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris.');
      navigate('/login');
      return;
    }
    setFavorite(!favorite);
    toast.success(!favorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
  };

  return (
    <Link
      to={`${basePath}/${product.id}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        className="card-hover"
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: '100%'
        }}
      >
        {/* ── Image Box ── */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}>
          <ProductImage
            src={product.image}
            alt={product.title}
            priority={priority}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
          />

          {/* Badges Supérieur Gauche */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5, display: 'flex', gap: 6 }}>
            {hasDiscount && discountPercent > 0 && (
              <span className="figma-promo-badge">
                -{discountPercent}%
              </span>
            )}
            {!hasDiscount && isBestseller && (
              <span className="figma-bestseller-badge">
                Bestseller
              </span>
            )}
            {!hasDiscount && !isBestseller && isNew && (
              <span className="figma-new-badge">
                Nouveau
              </span>
            )}
          </div>

          {/* Bouton Favoris Cœur (Supérieur Droite) */}
          <button
            type="button"
            onClick={toggleFavorite}
            title="Ajouter aux favoris"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 5,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: favorite ? '#ef4444' : 'rgba(255, 255, 255, 0.88)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: favorite ? 'white' : '#475569',
              transition: 'all 0.15s',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Heart size={16} fill={favorite ? 'currentColor' : 'none'} strokeWidth={2.2} />
          </button>
        </div>

        {/* ── Content Box ── */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {/* Badge Catégorie + Marque / Vendeur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="figma-category-badge">
              {product.category || 'High-Tech'}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
              {product.seller?.name || product.brand || 'SkyTech'}
            </span>
          </div>

          {/* Titre produit */}
          <h3
            style={{
              margin: 0,
              fontSize: 15.5,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.35,
              letterSpacing: '-0.2px'
            }}
            className="line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Notation 5 étoiles + avis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= Math.round(parseFloat(displayRating));
                return (
                  <Star
                    key={s}
                    size={12}
                    className={filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'}
                  />
                );
              })}
            </div>
            <span style={{ fontWeight: 600, color: '#64748b', fontSize: 12.5 }}>
              {displayRating} ({displayReviews})
            </span>
          </div>

          {/* Ligne Prix avec whiteSpace: nowrap pour éviter le retour à la ligne de FCFA */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px', marginTop: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
              {formatPrice(price)}
            </span>
            {hasDiscount && oldPrice && (
              <span style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>

          {/* Barre de progression Ventes Flash */}
          {isFlashSale && (
            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div className="figma-progress-track">
                <div className="figma-progress-bar" style={{ width: `${soldPercent}%` }} />
              </div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>
                {soldCount} vendus sur {totalStock}
              </span>
            </div>
          )}

          {/* Bouton Noir "Ajouter au panier" pleine largeur en bas - ne sera jamais coupé */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="figma-btn-dark"
            style={{
              width: '100%',
              marginTop: 'auto',
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 10,
              gap: 6,
              opacity: adding ? 0.7 : 1,
              flexShrink: 0
            }}
          >
            <ShoppingCart size={15} strokeWidth={2.3} />
            <span>{adding ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

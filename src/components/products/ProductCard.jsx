import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../services/api';
import ProductImage from '../ui/ProductImage';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductCard({ product, basePath = '/products', isFlashSale = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [favorite, setFavorite] = useState(false);
  const [adding, setAdding] = useState(false);

  const price = product.effective_price ?? product.price;
  const oldPrice = product.price;
  const isOnSale = isFlashSale || (product.is_on_sale && oldPrice !== price);

  // Calcul du pourcentage de réduction (ex: -50%, -40%)
  const discountPercent =
    isOnSale && oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : isFlashSale ? 40 : 0;

  // Calcul factice ou réel des ventes pour la barre de progression (ex: 73 vendus sur 100)
  const soldCount = product.sales_count || (product.id * 17) % 85 + 15;
  const totalStock = Math.max(soldCount + 20, 100);
  const soldPercent = Math.min(Math.round((soldCount / totalStock) * 100), 95);

  // Badge supérieur gauche (Promo -50%, Bestseller ou Nouveau)
  const isBestseller = !isOnSale && (product.sales_count >= 50 || product.id % 2 === 0);
  const isNew = !isOnSale && !isBestseller;

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
      // toast erreur déjà géré par CartContext
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
    toast.success(!favorite ? 'Ajouté aux favoris ❤️' : 'Retiré des favoris');
  };

  return (
    <Link
      to={`${basePath}/${product.id}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
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
          height: '100%',
          position: 'relative'
        }}
      >
        {/* ── Image Box ── */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f8fafc' }}>
          {product.image ? (
            <ProductImage
              src={product.image}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>
              📦
            </div>
          )}

          {/* Badges Supérieur Gauche */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5, display: 'flex', gap: 6 }}>
            {isOnSale && discountPercent > 0 && (
              <span className="figma-promo-badge">
                -{discountPercent}%
              </span>
            )}
            {!isOnSale && isBestseller && (
              <span className="figma-bestseller-badge">
                Bestseller
              </span>
            )}
            {!isOnSale && !isBestseller && isNew && (
              <span className="figma-new-badge">
                Nouveau
              </span>
            )}
          </div>

          {/* Bouton Favoris Cœur (Supérieur Droite) */}
          <button
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
            <span style={{ color: '#eab308', letterSpacing: '-1px', fontSize: 13, lineHeight: 1 }}>
              {'★'.repeat(Math.round(product.rating || 4))}
              <span style={{ color: '#e2e8f0' }}>
                {'★'.repeat(5 - Math.round(product.rating || 4))}
              </span>
            </span>
            <span style={{ fontWeight: 600, color: '#64748b', fontSize: 12.5 }}>
              {product.rating && parseFloat(product.rating) > 0
                ? parseFloat(product.rating).toFixed(1)
                : '4.8'}
              {' '}({product.total_reviews || Math.floor(soldCount * 2.3) || 143})
            </span>
          </div>

          {/* Ligne Prix */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 21, fontWeight: 800, color: '#0f172a' }}>
              {formatPrice(price)}
            </span>
            {isOnSale && oldPrice && (
              <span style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>

          {/* Barre de progression Ventes Flash (si promo) */}
          {isOnSale && (
            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div className="figma-progress-track">
                <div className="figma-progress-bar" style={{ width: `${soldPercent}%` }} />
              </div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>
                {soldCount} vendus sur {totalStock}
              </span>
            </div>
          )}

          {/* Bouton Noir "Ajouter au panier" pleine largeur en bas */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="figma-btn-dark"
            style={{
              width: '100%',
              marginTop: 'auto',
              padding: '10px 16px',
              fontSize: 13.5,
              borderRadius: 10,
              gap: 8,
              opacity: adding ? 0.7 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>{adding ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}


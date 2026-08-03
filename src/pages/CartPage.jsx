import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import { formatPrice } from '../services/api';

function CartContent() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const items = cart?.items || [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
        <EmptyState
          title="Votre panier Soukna est vide"
          description="Parcourez notre catalogue et découvrez des milliers d&apos;offres exceptionnelles."
          action={
            <Link to="/products" className="btn-primary" style={{
              display: 'inline-block', padding: '12px 28px', borderRadius: 99,
              fontWeight: 700, fontSize: 14, textDecoration: 'none'
            }}>
              Explorer le catalogue →
            </Link>
          }
        />
      </div>
    );
  }

  const total = cart?.total ?? items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 64px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, marginBottom: 32,
        borderBottom: '1px solid var(--border)', paddingBottom: 20
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Mon Panier <span style={{ color: '#6366f1' }}>({items.length})</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
            Vérifiez vos articles avant de finaliser votre commande en toute sécurité.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          style={{
            padding: '8px 16px', borderRadius: 99, border: '1.5px solid #fecaca',
            background: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit'
          }}
          onMouseEnter={e => e.target.style.background = '#fee2e2'}
          onMouseLeave={e => e.target.style.background = '#fef2f2'}
        >
          🗑️ Vider le panier
        </button>
      </div>

      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {/* Liste des articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="card-hover"
              style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18,
                borderRadius: 20, border: '1px solid var(--border)', background: 'white',
                padding: '18px 20px', boxShadow: 'var(--shadow-xs)', position: 'relative'
              }}
            >
              {item.product?.image ? (
                <ProductImage
                  src={item.product.image}
                  alt={item.product.title}
                  style={{ width: 84, height: 84, borderRadius: 14, objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 84, height: 84, borderRadius: 14, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                  📦
                </div>
              )}

              <div style={{ flex: '1 1 200px', minWidth: 160 }}>
                <Link to={`/products/${item.product?.id}`} style={{
                  fontSize: 16, fontWeight: 700, color: '#0f172a',
                  textDecoration: 'none', display: 'block', marginBottom: 4,
                  lineHeight: 1.3
                }}>
                  {item.product?.title}
                </Link>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                  Prix unitaire : <strong style={{ color: '#334155' }}>{formatPrice(item.product?.effective_price)}</strong>
                </p>
                {item.product?.quantity !== undefined && Number(item.product.quantity) < item.quantity && (
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 6, background: '#fef2f2', color: '#ef4444', fontSize: 11, fontWeight: 700 }}>
                    ⚠️ Stock : {item.product.quantity} dispo
                  </span>
                )}
              </div>

              {/* Quantité & Prix */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4, background: '#f8fafc',
                  border: '1px solid var(--border)', borderRadius: 99, padding: '2px 6px'
                }}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', border: 'none',
                      background: 'white', color: '#0f172a', fontWeight: 700,
                      cursor: 'pointer', boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', border: 'none',
                      background: 'white', color: '#0f172a', fontWeight: 700,
                      cursor: 'pointer', boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ textAlign: 'right', minWidth: 90 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#4f46e5' }}>
                    {formatPrice(item.subtotal)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  style={{
                    border: 'none', background: 'transparent', color: '#94a3b8',
                    cursor: 'pointer', fontSize: 18, padding: 4,
                    transition: 'color .15s'
                  }}
                  onMouseEnter={e => e.target.style.color = '#ef4444'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}
                  title="Supprimer l'article"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Résumé */}
        <div style={{ flex: '0 0 340px' }}>
          <div style={{
            borderRadius: 24, border: '1px solid var(--border)', background: 'white',
            padding: '28px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 90
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 19, fontWeight: 800, color: '#0f172a' }}>
              Résumé de la commande
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                <span>Sous-total ({items.length} articles)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                <span>Livraison standard</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>Gratuit</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#4f46e5' }}>
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="btn-primary"
              style={{
                display: 'block', width: '100%', padding: '15px 0',
                borderRadius: 99, textAlign: 'center', fontWeight: 700,
                fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)'
              }}
            >
              Valider mon panier →
            </Link>

            {/* Badges de confiance */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                <span style={{ fontSize: 16 }}>🛡️</span> Paiement 100% sécurisé et crypté
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                <span style={{ fontSize: 16 }}>🤝</span> Protection acheteur Soukna garantie
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}

import { Link } from 'react-router-dom';
import { formatPrice } from '../../services/api';
import ProductImage from '../ui/ProductImage';

export default function ProductCard({ product, basePath = '/products' }) {
  const price = product.effective_price ?? product.price;
  const isOnSale = product.is_on_sale && product.price !== price;

  return (
    <Link to={`${basePath}/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 16, border: '1.5px solid var(--border)',
        overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'all .2s',
        display: 'flex', flexDirection: 'column', height: '100%'
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: '#f8fafc' }}>
          {product.image ? (
            <ProductImage src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>📦</div>
          )}
          {isOnSale && (
            <span style={{
              position: 'absolute', top: 10, left: 10,
              padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: '#ef4444', color: 'white'
            }}>PROMO</span>
          )}
          {product.rating && parseFloat(product.rating) > 0 && (
            <span style={{
              position: 'absolute', bottom: 10, right: 10,
              padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600,
              background: 'rgba(0,0,0,.55)', color: 'white',
              display: 'flex', alignItems: 'center', gap: 3, backdropFilter: 'blur(4px)'
            }}>⭐ {parseFloat(product.rating).toFixed(1)}</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }} className="line-clamp-2">
            {product.title}
          </h3>
          {product.seller && (
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
              par {product.seller.name}
            </p>
          )}
          <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{formatPrice(price)}</span>
              {isOnSale && (
                <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.sales_count > 0 && (
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{product.sales_count} ventes</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

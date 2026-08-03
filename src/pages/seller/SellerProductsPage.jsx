import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = () => {
    setLoading(true);
    const params = status ? { status } : {};
    productService
      .getMyProducts(params)
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      toast.success('Produit supprimé avec succès');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.category?.name?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const TABS = [
    { value: '', label: 'Tous les produits' },
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'sold', label: 'Vendus / Épuisés' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Mes produits</h1>
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Gérez vos articles mis en vente sur la marketplace Soukna</p>
        </div>
        <Link
          to="/seller/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau produit
        </Link>
      </div>

      {/* Barre de filtres par statut + recherche */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: '#ffffff',
        padding: '12px 16px',
        borderRadius: 16,
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 20,
      }}>
        {/* Onglets statut */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {TABS.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatus(tab.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: active ? 700 : 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? '#0f172a' : 'transparent',
                  color: active ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div style={{ position: 'relative', width: 260 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              fontSize: 13,
              outline: 'none',
              background: '#f8fafc',
            }}
          />
        </div>
      </div>

      {/* Tableau des produits */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit trouvé'}
          subtitle={searchQuery ? 'Essayez avec de plus amples termes' : 'Commencez par ajouter votre premier article en vente.'}
        />
      ) : (
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1.5px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Produit</th>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Catégorie</th>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prix</th>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stock</th>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Statut</th>
                  <th style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: index < filteredProducts.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {p.image ? (
                          <ProductImage
                            src={p.image}
                            alt=""
                            style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{p.title}</p>
                          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Réf: #{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                      {p.category?.name || 'Général'}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                      {formatPrice(p.price)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        background: p.quantity > 0 ? '#f0fdf4' : '#fef2f2',
                        color: p.quantity > 0 ? '#15803d' : '#b91c1c',
                      }}>
                        {p.quantity > 0 ? `${p.quantity} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <Link
                          to={`/seller/products/${p.id}/edit`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#0f172a',
                            background: '#f1f5f9',
                            textDecoration: 'none',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#ef4444',
                            background: '#fef2f2',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SellerProductsPage() {
  return <SellerProducts />;
}

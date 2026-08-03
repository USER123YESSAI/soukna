import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductImage from '../components/ui/ProductImage';
import StatusBadge from '../components/ui/StatusBadge';
import InlineChat from '../components/messages/InlineChat';
import { formatPrice, formatDate, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

function OrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChats, setOpenChats] = useState({}); // { sellerId: true/false }

  const load = () => {
    orderService
      .getById(id)
      .then(({ data }) => setOrder(data.order || data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Annuler cette commande ?')) return;
    try {
      await orderService.cancel(id);
      toast.success('Commande annulée');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Extraire les vendeurs uniques de la commande
  const uniqueSellers = useMemo(() => {
    if (!order?.items) return [];
    const seen = new Map();
    order.items.forEach(item => {
      if (item.seller && !seen.has(item.seller.id)) {
        seen.set(item.seller.id, item.seller);
      }
    });
    return Array.from(seen.values());
  }, [order]);

  const toggleChat = (sellerId) => {
    setOpenChats(prev => ({ ...prev, [sellerId]: !prev[sellerId] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) return <p>Commande introuvable.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/buyer/orders" className="text-sm text-indigo-600 hover:underline">
        ← Retour aux commandes
      </Link>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold">{order.order_number}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{formatDate(order.created_at)}</p>

        <div className="mt-6 space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-3">
              {item.product?.image && (
                <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                  <ProductImage src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{item.product?.title}</p>
                <p className="text-sm text-slate-500">
                  {item.quantity} × {formatPrice(item.unit_price)}
                </p>
                {item.seller && <p className="text-xs text-slate-400">Vendeur : {item.seller.name}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <p className="font-medium" style={{ margin: 0 }}>{formatPrice(item.subtotal)}</p>
                {item.product?.id && (
                  <Link
                    to={`/products/${item.product.id}#reviews-section`}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#4f46e5',
                      textDecoration: 'none',
                      background: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: 99,
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    ⭐ Noter le produit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 text-sm">
          {order.discount_amount > 0 && (
            <p className="text-green-600">Réduction : -{formatPrice(order.discount_amount)}</p>
          )}
          {order.coupon && <p>Coupon : {order.coupon.code}</p>}
          <p className="text-lg font-bold text-indigo-600">Total : {formatPrice(order.total_amount)}</p>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
          <p>{order.shipping_address}</p>
          <p>{order.shipping_postal_code} {order.shipping_city}</p>
          <p>{order.shipping_phone}</p>
        </div>

        {order.status === 'pending' && (
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Annuler la commande
          </button>
        )}
      </div>

      {/* ── Messagerie avec le(s) vendeur(s) ── */}
      {isAuthenticated && uniqueSellers.length > 0 && (
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {uniqueSellers.map(seller => (
            <div key={seller.id}>
              {/* Bouton toggle */}
              <button
                type="button"
                onClick={() => toggleChat(seller.id)}
                style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: openChats[seller.id] ? '14px 14px 0 0' : 14,
                  border: '1.5px solid var(--border)',
                  borderBottom: openChats[seller.id] ? 'none' : '1.5px solid var(--border)',
                  background: openChats[seller.id] ? '#f8fafc' : 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!openChats[seller.id]) e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={e => { if (!openChats[seller.id]) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: 18 }}>💬</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                  Contacter {seller.name}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', transition: 'transform .2s', transform: openChats[seller.id] ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▼
                </span>
              </button>

              {/* Chat inline */}
              {openChats[seller.id] && (
                <div style={{ borderRadius: '0 0 14px 14px', overflow: 'hidden', marginTop: -1 }}>
                  <InlineChat
                    recipientId={seller.id}
                    recipientName={seller.name}
                    title={`💬 Discussion avec ${seller.name}`}
                    maxHeight={300}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return <OrderDetail />;
}

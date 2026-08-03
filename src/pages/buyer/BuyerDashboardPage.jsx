import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { favoriteService } from '../../services/favoriteService';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatPrice, formatDate, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import MessagesWidget from '../../components/messages/MessagesWidget';

function KpiCard({ icon, label, value, sub, color = '#10b981', linkTo, linkLabel }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {linkTo && (
            <Link to={linkTo} style={{ fontSize: 12, color: color, textDecoration: 'none', fontWeight: 600 }}>
              {linkLabel ?? 'Voir →'}
            </Link>
          )}
          {icon && <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function BuyerDashboard() {
  const { itemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getMyOrders({ page: 1 }).catch(() => ({ data: { data: [] } })),
      favoriteService.getAll().catch(() => ({ data: { data: [] } })),
    ]).then(([ordersRes, favRes]) => {
      const list = ordersRes.data?.data ?? ordersRes.data?.orders ?? [];
      setOrders(Array.isArray(list) ? list.slice(0, 5) : []);
      const favs = favRes.data?.data ?? favRes.data?.favorites ?? [];
      setFavoritesCount(Array.isArray(favs) ? favs.length : 0);
    }).catch(err => toast.error(getErrorMessage(err))).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Tableau de bord</h1>
      </div>

      <div className="dashboard-kpi-grid">
        <KpiCard label="Commandes récentes" value={orders.length > 0 ? orders.length : 0} sub={pendingCount ? `${pendingCount} en attente` : 'sur les 5 dernières'} color="#6366f1" linkTo="/buyer/orders" />
        <KpiCard label="Favoris" value={favoritesCount} color="#ec4899" linkTo="/buyer/favorites" />
        <KpiCard label="Panier" value={itemCount} sub={itemCount === 1 ? 'article' : 'articles'} color="#10b981" linkTo="/buyer/cart" />
      </div>

      <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Dernières commandes</h2>
          <Link to="/buyer/orders" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
        </div>
        {orders.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ margin: '0 0 12px', fontWeight: 500 }}>Aucune commande pour le moment</p>
            <Link to="/products" style={{ fontSize: 13, fontWeight: 600, color: '#10b981', textDecoration: 'none' }}>
              Parcourir le catalogue →
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order, i) => (
              <Link
                key={order.id}
                to={`/buyer/orders/${order.id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '16px 24px', textDecoration: 'none', color: 'inherit',
                  borderBottom: i < orders.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14 }}>{order.order_number ?? `Commande #${order.id}`}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{formatDate(order.created_at)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(order.total_amount)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Messagerie */}
      <div style={{ marginTop: 32 }}>
        <MessagesWidget />
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return <BuyerDashboard />;
}

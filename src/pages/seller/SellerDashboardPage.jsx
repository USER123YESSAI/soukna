import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import MessagesWidget from '../../components/messages/MessagesWidget';

const STATUS_LABEL = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' };
const STATUS_COLOR = { pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
const STATUS_BG = { pending: '#fffbeb', confirmed: '#eff6ff', shipped: '#f5f3ff', delivered: '#f0fdf4', cancelled: '#fef2f2' };

function KpiCard({ icon, label, value, sub, color = '#6366f1' }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function SellerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sellerService.getDashboard(),
      sellerService.getStatistics(),
      sellerService.getOrders().catch(() => ({ data: { data: [] } })),
    ]).then(([dashRes, statsRes, ordersRes]) => {
      setDashboard(dashRes.data);
      setStats(statsRes.data);
      const orders = ordersRes.data?.data ?? ordersRes.data ?? [];
      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
    }).catch(err => toast.error(getErrorMessage(err))).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner size="lg" /></div>;

  const totalRevenue = dashboard?.total_sales ?? 0;
  const totalOrders = dashboard?.total_orders ?? 0;
  const pendingOrders = dashboard?.pending_orders ?? 0;
  const totalProducts = dashboard?.active_products ?? dashboard?.total_products ?? 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Tableau de bord</h1>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KpiCard icon="💰" label="Revenus totaux" value={formatPrice(totalRevenue)} sub="toutes commandes" color="#10b981" />
        <KpiCard icon="🛒" label="Commandes" value={totalOrders} sub={`${pendingOrders} en attente`} color="#6366f1" />
        <KpiCard icon="📦" label="Produits publiés" value={totalProducts} color="#f59e0b" />
        <KpiCard icon="⭐" label="Note moyenne" value={stats?.average_rating ? parseFloat(stats.average_rating).toFixed(1) + ' / 5' : '—'} color="#ec4899" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Recent orders */}
        <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Commandes récentes</h2>
            <Link to="/seller/orders" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
              <p style={{ margin: 0, fontWeight: 500 }}>Aucune commande reçue</p>
            </div>
          ) : (
            <div>
              {recentOrders.map((order, i) => (
                <div key={order.id} style={{ padding: '16px 24px', borderBottom: i < recentOrders.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14 }}>Commande #{order.id}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
                      {' · '}{order.items?.length ?? 0} article(s)
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(order.total_amount ?? 0)}</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      color: STATUS_COLOR[order.status] ?? '#64748b',
                      background: STATUS_BG[order.status] ?? '#f8fafc'
                    }}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Statistiques détaillées</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Vues totales', stats?.total_views ?? 0],
                ['Taux de conversion', stats?.conversion_rate ? stats.conversion_rate + '%' : '0%'],
                ['Panier moyen', formatPrice(stats?.average_order_value ?? 0)],
                ['Satisfaction client', stats?.customer_satisfaction ? stats.customer_satisfaction + ' / 5' : '—'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 20, padding: 24, color: 'white' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>Boostez vos ventes</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, opacity: .85, lineHeight: 1.5 }}>
              Ajoutez une promotion flash pour augmenter la visibilité de vos produits.
            </p>
            <Link to="/seller/products" style={{ display: 'block', textAlign: 'center', padding: '9px 0', borderRadius: 10, background: 'rgba(255,255,255,.2)', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,.3)' }}>
              Gérer mes produits →
            </Link>
          </div>
        </div>
      </div>

      {/* Messagerie */}
      <div style={{ marginTop: 32 }}>
        <MessagesWidget />
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return <SellerDashboard />;
}

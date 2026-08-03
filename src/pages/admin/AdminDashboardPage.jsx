import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import MessagesWidget from '../../components/messages/MessagesWidget';

function KpiCard({ icon, label, value, sub, color, linkTo, linkLabel }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {icon && <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>}
        {linkTo && <Link to={linkTo} style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>{linkLabel ?? 'Voir →'}</Link>}
      </div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(({ data }) => setStats(data))
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Tableau de bord</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KpiCard label="Utilisateurs" value={stats?.users_count ?? stats?.total_users ?? 0} sub="comptes actifs" color="#6366f1" linkTo="/admin/users" />
        <KpiCard label="Produits" value={stats?.products_count ?? stats?.total_products ?? 0} sub="dans le catalogue" color="#f59e0b" linkTo="/admin/products" />
        <KpiCard label="Commandes" value={stats?.orders_count ?? stats?.total_orders ?? 0} color="#10b981" />
        <KpiCard label="Revenus" value={formatPrice(stats?.total_revenue ?? 0)} color="#ec4899" />
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Quick actions */}
        <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Actions rapides</h2>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { to: '/admin/users', label: 'Gérer les utilisateurs', desc: 'Suspendre, réactiver des comptes', color: '#6366f1' },
              { to: '/admin/products', label: 'Modérer les produits', desc: 'Valider, rejeter des produits', color: '#f59e0b' },
              { to: '/admin/coupons', label: 'Gérer les coupons', desc: 'Créer et modifier des codes promo', color: '#10b981' },
            ].map(({ to, icon, label, desc, color }) => (
              <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid var(--border)', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                {icon && <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 18 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Détails statistiques</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {Object.entries(stats ?? {}).map(([key, val]) => {
                if (typeof val !== 'number' && typeof val !== 'string') return null;
                const labels = {
                  users_count: 'Utilisateurs', total_users: 'Utilisateurs',
                  products_count: 'Produits', total_products: 'Produits',
                  orders_count: 'Commandes', total_orders: 'Commandes',
                  total_revenue: 'Revenu total',
                  sellers_count: 'Vendeurs', buyers_count: 'Acheteurs',
                  pending_orders: 'Commandes en attente',
                };
                if (!labels[key]) return null;
                const isRevenue = key === 'total_revenue';
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{labels[key]}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      {isRevenue ? formatPrice(val) : val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert card */}
          <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: 16, padding: '20px 24px', border: '1.5px solid #fcd34d' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#92400e' }}>Produits en attente</h4>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#b45309', lineHeight: 1.5 }}>
              Des produits soumis par les vendeurs attendent votre validation.
            </p>
            <Link to="/admin/products" style={{ fontSize: 13, fontWeight: 700, color: '#92400e', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Modérer maintenant →
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

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}

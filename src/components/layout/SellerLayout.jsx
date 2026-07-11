import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const SELLER_NAV = [
  { to: '/seller', label: 'Tableau de bord', icon: '📊', end: true },
  { to: '/seller/catalogue', label: 'Catalogue', icon: '🛍️' },
  {
    to: '/seller/products',
    label: 'Mes produits',
    icon: '📦',
    end: true,
    isActive: (_, location) => {
      const p = location.pathname;
      return p === '/seller/products' || /^\/seller\/products\/\d+\/edit$/.test(p);
    },
  },
  { to: '/seller/products/new', label: 'Nouveau produit', icon: '➕', end: true },
  { to: '/seller/orders', label: 'Commandes', icon: '🛒' },
  { to: '/seller/messages', label: 'Messages', icon: '💬' },
];

export default function SellerLayout() {
  return (
    <ProtectedRoute roles={['seller', 'admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Espace Vendeur"
          subtitle="Mon activité"
          accentColor="#6366f1"
          navItems={SELLER_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

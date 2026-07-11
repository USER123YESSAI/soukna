import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const BUYER_NAV = [
  { to: '/buyer', label: 'Tableau de bord', icon: '📊', end: true },
  { to: '/buyer/catalogue', label: 'Catalogue', icon: '🛍️' },
  {
    to: '/buyer/orders',
    label: 'Mes commandes',
    icon: '🛒',
    isActive: (_, location) => location.pathname.startsWith('/buyer/orders'),
  },
  { to: '/buyer/favorites', label: 'Favoris', icon: '❤️', end: true },
  { to: '/buyer/messages', label: 'Messages', icon: '💬', end: true },
  { to: '/buyer/cart', label: 'Panier', icon: '🛍️', end: true },
  { to: '/buyer/profile', label: 'Mon profil', icon: '👤', end: true },
];

export default function BuyerLayout() {
  return (
    <ProtectedRoute roles={['buyer', 'admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Espace Acheteur"
          subtitle="Mon compte"
          accentColor="#10b981"
          navItems={BUYER_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

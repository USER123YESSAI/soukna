import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const BUYER_NAV = [
  { to: '/buyer', label: 'Accueil', icon: 'home', end: true },
  { type: 'section', label: 'ACHATS & SUIVI' },
  { to: '/buyer/catalogue', label: 'Catalogue', icon: 'grid' },
  {
    to: '/buyer/orders',
    label: 'Mes commandes',
    icon: 'shopping-bag',
    isActive: (_, location) => location.pathname.startsWith('/buyer/orders'),
  },
  { to: '/buyer/favorites', label: 'Favoris', icon: 'heart', end: true },
  { to: '/buyer/cart', label: 'Panier', icon: 'shopping-cart', end: true },
  { type: 'section', label: 'COMPTE' },
  { to: '/buyer/messages', label: 'Messages', icon: 'message-square', end: true },
  { to: '/buyer/profile', label: 'Mon profil', icon: 'user', end: true },
];

export default function BuyerLayout() {
  return (
    <ProtectedRoute roles={['buyer', 'admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Espace Acheteur"
          subtitle="Mon compte"
          accentColor="#059669"
          navItems={BUYER_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}


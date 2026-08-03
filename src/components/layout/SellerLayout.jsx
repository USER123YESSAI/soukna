import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const SELLER_NAV = [
  { to: '/seller', label: 'Accueil', icon: 'home', end: true },
  { type: 'section', label: 'COMMERCE' },
  {
    label: 'Produits',
    icon: 'package',
    to: '/seller/products',
    children: [
      { to: '/seller/products', label: 'Mes produits', end: true },
      { to: '/seller/products/new', label: 'Nouveau produit', end: true },
    ]
  },
  { to: '/seller/catalogue', label: 'Catalogue global', icon: 'grid' },
  { to: '/seller/orders', label: 'Commandes', icon: 'shopping-bag' },
  { type: 'section', label: 'RELATION CLIENT' },
  { to: '/seller/messages', label: 'Messages', icon: 'message-square' },
];

export default function SellerLayout() {
  return (
    <ProtectedRoute roles={['seller', 'admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Espace Vendeur"
          subtitle="Mon activité"
          accentColor="#059669"
          navItems={SELLER_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}


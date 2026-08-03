import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const ADMIN_NAV = [
  { to: '/admin', label: 'Accueil', icon: 'home', end: true },
  { type: 'section', label: 'GESTION' },
  { to: '/admin/users', label: 'Utilisateurs', icon: 'users' },
  { to: '/admin/products', label: 'Modération produits', icon: 'shield' },
  { to: '/admin/catalogue', label: 'Catalogue global', icon: 'grid' },
  { type: 'section', label: 'CONFIG & MARKETING' },
  {
    label: 'Catalogue & Rendu',
    icon: 'folder',
    to: '/admin/categories',
    children: [
      { to: '/admin/categories', label: 'Catégories', end: true },
      { to: '/admin/coupons', label: 'Coupons promotionnels', end: true },
    ]
  },
  { to: '/admin/messages', label: 'Messages globaux', icon: 'send' },
];

export default function AdminLayout() {
  return (
    <ProtectedRoute roles={['admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Administration"
          subtitle="Espace admin"
          accentColor="#059669"
          navItems={ADMIN_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}


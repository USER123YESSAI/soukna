import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';

const ADMIN_NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: '📊', end: true },
  { to: '/admin/catalogue', label: 'Catalogue', icon: '🛍️' },
  { to: '/admin/users', label: 'Utilisateurs', icon: '👥' },
  { to: '/admin/products', label: 'Modération produits', icon: '📦' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎫' },
  { to: '/admin/messages', label: 'Messages', icon: '💬' },
];

export default function AdminLayout() {
  return (
    <ProtectedRoute roles={['admin']}>
      <div className="dashboard-shell">
        <DashboardSidebar
          title="Administration"
          subtitle="Espace admin"
          accentColor="#ef4444"
          navItems={ADMIN_NAV}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

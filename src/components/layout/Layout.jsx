import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  // Masquer le footer dans les espaces acheteur, vendeur et admin
  const isDashboardSpace =
    location.pathname.startsWith('/buyer') ||
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--surface-2)' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      {!isDashboardSpace && <Footer />}
    </div>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import { messageService } from '../../services/messageService';
import NotificationCenter from './NotificationCenter';

const Logo = () => (
  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    </div>
    <span style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', letterSpacing: '-0.3px' }}>Soukna</span>
  </Link>
);

// Navbar visiteur non connecté
function PublicNavbar({ menuOpen, setMenuOpen }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 20, height: 64, width: '100%', boxSizing: 'border-box' }}>
        <Logo />

        {/* Tout le reste à droite dans un seul groupe */}
        <div style={{ margin: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>

          {/* Liens navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 8 }} className="desktop-nav">
            {[
              { to: '/', label: 'Accueil', end: true },
              { to: '/login', label: 'Connexion' },
              { to: '/register', label: 'Inscription' },
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
                padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                textDecoration: 'none', transition: 'all .15s',
                color: isActive ? '#6366f1' : '#475569',
                background: isActive ? '#eef2ff' : 'transparent',
              })}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'none', marginLeft: 4 }} className="mobile-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'white', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[{ to: '/', label: '🏠 Accueil' }, { to: '/login', label: '🔑 Connexion' }, { to: '/register', label: '✨ Inscription' }].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: '#475569' }}>{label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}

// Navbar utilisateur connecté
function AuthNavbar({ user, isBuyer, isSeller, isAdmin, itemCount, unreadCount, logout, menuOpen, setMenuOpen }) {
  const dashboardLink = isAdmin ? '/admin' : isSeller ? '/seller' : '/buyer';
  const messagesLink = isBuyer ? '/buyer/messages' : isSeller ? '/seller/messages' : '/admin/messages';
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 12, height: 64, width: '100%', boxSizing: 'border-box' }}>
        <Logo />

        {/* Lien dashboard selon rôle */}
        <NavLink to={dashboardLink} style={({ isActive }) => ({
          marginLeft: 12, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          textDecoration: 'none', color: isActive ? '#6366f1' : '#475569',
          background: isActive ? '#eef2ff' : 'transparent', transition: 'all .15s'
        })} className="desktop-nav-item">
          {isAdmin ? '⚡ Admin' : isSeller ? '📦 Vendeur' : '🏠 Mon espace'}
        </NavLink>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Centre de notifications (Cloche in-app) */}
          <NotificationCenter />

          {/* Messages avec badge non lus */}
          <Link to={messagesLink} style={{ position: 'relative', padding: 8, borderRadius: 10, color: '#475569', display: 'flex', textDecoration: 'none', transition: 'all .15s' }} className="icon-btn" title="Messages">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 99, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', animation: 'pulse 2s infinite' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Menu Déroulant (Dropdown) Avatar Utilisateur */}
          <div style={{ position: 'relative' }} className="desktop-nav-item">
            {/* Seul l'Avatar de l'utilisateur est visible */}
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title="Compte & Paramètres"
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                background: isAdmin
                  ? 'linear-gradient(135deg, #ef4444, #f97316)'
                  : isSeller
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14.5,
                border: '2px solid white',
                boxShadow: profileMenuOpen
                  ? '0 0 0 3px rgba(99, 102, 241, 0.3), 0 2px 6px rgba(15, 23, 42, 0.1)'
                  : '0 2px 6px rgba(15, 23, 42, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {/* Backdrop transparent pour fermer le menu lors d'un clic extérieur */}
            {profileMenuOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                onClick={() => setProfileMenuOpen(false)}
              />
            )}

            {/* Carte Dropdown Moderne & Intuitif */}
            {profileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 240,
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
                  zIndex: 100,
                  overflow: 'hidden',
                  transformOrigin: 'top right',
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                {/* En-tête de compte */}
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Utilisateur'}
                  </div>
                  {user?.email && (
                    <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email}
                    </div>
                  )}
                  <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: isAdmin ? '#fef2f2' : isSeller ? '#eef2ff' : '#eff6ff', color: isAdmin ? '#ef4444' : isSeller ? '#6366f1' : '#3b82f6' }}>
                    {isAdmin ? '⚡ Administrateur' : isSeller ? '📦 Vendeur' : '🏠 Acheteur'}
                  </div>
                </div>

                {/* Liste des options */}
                <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Option 1 : Mon profil */}
                  <Link
                    to={isBuyer ? '/buyer/profile' : '/profile'}
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: 13.5,
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#4f46e5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0f172a'; }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Mon profil</span>
                  </Link>

                  {/* Ligne de séparation */}
                  <div style={{ height: 1, background: '#f1f5f9', margin: '4px 6px' }} />

                  {/* Option 2 : Déconnexion */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'none' }} className="mobile-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu connecté */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'white', padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Link to={dashboardLink} onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: '#6366f1' }}>
              {isAdmin ? '⚡ Tableau de bord Admin' : isSeller ? '📦 Espace Vendeur' : '🏠 Mon espace'}
            </Link>
            <Link to={messagesLink} onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: '#475569' }}>
              💬 Messages {unreadCount > 0 && <span style={{ marginLeft: 6, background: '#ef4444', color: 'white', borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{unreadCount}</span>}
            </Link>
            <button onClick={() => { logout(); setMenuOpen(false); }} style={{ padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500, textAlign: 'left', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>🚪 Déconnexion</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout, isSeller, isAdmin, isBuyer } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Polling messages non lus toutes les 30s
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUnread = () => {
      messageService.getUnreadCount()
        .then(({ data }) => setUnreadCount(data.count ?? data.unread_count ?? 0))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated
        ? <AuthNavbar user={user} isBuyer={isBuyer} isSeller={isSeller} isAdmin={isAdmin} itemCount={itemCount} unreadCount={unreadCount} logout={logout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        : <PublicNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      }
      <style>{`
        @media (min-width: 768px) { .md-search { display: block !important; } .show-md { display: inline !important; } }
        @media (max-width: 900px) { .desktop-nav-item { display: none !important; } }
        @media (max-width: 768px) { .mobile-toggle { display: flex !important; } }
        .icon-btn:hover { background: var(--surface-2) !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
      `}</style>
    </>
  );
}
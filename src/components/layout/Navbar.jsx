import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import { messageService } from '../../services/messageService';
import NotificationCenter from './NotificationCenter';
import { Menu, X, MessageSquare, User, LogOut, ShoppingCart, Search, Plus } from 'lucide-react';

const Logo = () => (
  <Link to="/" className="navbar-logo-link" aria-label="Soukna Accueil">
    <div className="navbar-logo-badge">
      <img
        src="/soukna-icon.jpg"
        alt="Soukna"
        className="navbar-logo-img"
      />
    </div>
  </Link>
);

// Barre de recherche centrale
function NavbarSearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`navbar-search-form ${className}`} role="search">
      <Search size={16} className="navbar-search-icon" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher des articles, catégories..."
        className="navbar-search-input"
        aria-label="Rechercher sur Soukna"
      />
    </form>
  );
}

// Hook pour détecter le scroll et adapter l'apparence sticky
function useScrolled(threshold = 10) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return isScrolled;
}

// Navbar visiteur non connecté
function PublicNavbar({ menuOpen, setMenuOpen }) {
  const isScrolled = useScrolled(10);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, setMenuOpen]);

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Groupe gauche : Logo + Liens de navigation élégants */}
        <div className="navbar-left-group">
          <Logo />
          <nav className="navbar-desktop-nav" aria-label="Navigation principale">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-navlink ${isActive ? 'navbar-navlink-active' : ''}`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `navbar-navlink ${isActive ? 'navbar-navlink-active' : ''}`}
            >
              Catalogue
            </NavLink>
          </nav>
        </div>

        {/* Centre : Barre de recherche dynamique */}
        <div className="navbar-center-group">
          <NavbarSearchBar />
        </div>

        {/* Groupe droit : Bouton Vendre + Connexion + Inscription */}
        <div className="navbar-right-group">
          {/* Bouton Vendre / Déposer une annonce */}
          <Link
            to="/login"
            className="navbar-btn-sell navbar-desktop-nav"
            title="Vendre sur Soukna"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Vendre</span>
          </Link>

          {/* Actions Connexion / Inscription */}
          <div className="navbar-auth-actions navbar-desktop-nav">
            <NavLink
              to="/login"
              className={({ isActive }) => `navbar-btn-login ${isActive ? 'navbar-btn-login-active' : ''}`}
            >
              Connexion
            </NavLink>
            <Link
              to="/register"
              className="navbar-btn-register"
            >
              S'inscrire
            </Link>
          </div>

          {/* Toggle Hamburger Mobile SVG */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-mobile-toggle"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="navbar-mobile-search-wrapper">
            <NavbarSearchBar />
          </div>

          <nav className="navbar-mobile-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Catalogue
            </NavLink>
            <Link
              to="/login"
              className="navbar-mobile-link"
              style={{ color: '#4f46e5', fontWeight: 600 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Vendre un article
              </span>
            </Link>
          </nav>

          <div className="navbar-mobile-divider" />

          <div className="navbar-mobile-auth">
            <Link to="/login" className="navbar-mobile-btn-login">
              Connexion
            </Link>
            <Link to="/register" className="navbar-mobile-btn-register">
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// Navbar utilisateur connecté
function AuthNavbar({ user, isBuyer, isSeller, isAdmin, itemCount, unreadCount, logout, menuOpen, setMenuOpen }) {
  const isScrolled = useScrolled(10);
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const dashboardLink = isAdmin ? '/admin' : isSeller ? '/seller' : '/buyer';
  const messagesLink = isBuyer ? '/buyer/messages' : isSeller ? '/seller/messages' : '/admin/messages';
  const sellLink = isSeller ? '/seller/products/new' : '/seller';

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname, setMenuOpen]);

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Groupe gauche : Logo + Liens réguliers & Dashboard */}
        <div className="navbar-left-group">
          <Logo />
          <nav className="navbar-desktop-nav" aria-label="Navigation connectée">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-navlink ${isActive ? 'navbar-navlink-active' : ''}`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `navbar-navlink ${isActive ? 'navbar-navlink-active' : ''}`}
            >
              Catalogue
            </NavLink>
            <NavLink
              to={dashboardLink}
              className={({ isActive }) => `navbar-navlink navbar-role-badge ${isActive ? 'navbar-navlink-active' : ''}`}
            >
              {isAdmin ? 'Administration' : isSeller ? 'Espace Vendeur' : 'Mon espace'}
            </NavLink>
          </nav>
        </div>

        {/* Centre : Barre de recherche */}
        <div className="navbar-center-group">
          <NavbarSearchBar />
        </div>

        {/* Groupe droit : Vendre + Panier + Notifications + Messages + Avatar */}
        <div className="navbar-right-group">
          {/* Bouton Vendre pour utilisateurs */}
          <Link
            to={sellLink}
            className="navbar-btn-sell navbar-desktop-nav"
            title="Déposer une annonce"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Vendre</span>
          </Link>

          {/* Panier Acheteur */}
          {isBuyer && (
            <Link
              to="/buyer/cart"
              className="navbar-icon-btn"
              title="Panier"
              aria-label="Voir mon panier"
            >
              <ShoppingCart size={19} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="navbar-badge-pill navbar-badge-cart">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Notifications */}
          <NotificationCenter />

          {/* Messages */}
          <Link
            to={messagesLink}
            className="navbar-icon-btn"
            title="Messages"
            aria-label="Voir mes messages"
          >
            <MessageSquare size={19} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="navbar-badge-pill navbar-badge-unread">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Menu Profil Avatar Dropdown */}
          <div style={{ position: 'relative' }} className="navbar-desktop-nav">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title="Compte & Paramètres"
              aria-haspopup="true"
              aria-expanded={profileMenuOpen}
              className="navbar-avatar-btn"
              style={{
                background: isAdmin
                  ? 'linear-gradient(135deg, #ef4444, #f97316)'
                  : isSeller
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {profileMenuOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                onClick={() => setProfileMenuOpen(false)}
              />
            )}

            {profileMenuOpen && (
              <div className="navbar-dropdown-card">
                <div className="navbar-dropdown-header">
                  <div className="navbar-dropdown-name">{user?.name || 'Utilisateur'}</div>
                  {user?.email && (
                    <div className="navbar-dropdown-email">{user?.email}</div>
                  )}
                  <div
                    className="navbar-dropdown-role"
                    style={{
                      background: isAdmin ? '#fef2f2' : isSeller ? '#eef2ff' : '#eff6ff',
                      color: isAdmin ? '#ef4444' : isSeller ? '#6366f1' : '#3b82f6',
                    }}
                  >
                    {isAdmin ? 'Administrateur' : isSeller ? 'Vendeur' : 'Acheteur'}
                  </div>
                </div>

                <div className="navbar-dropdown-body">
                  <Link
                    to={isBuyer ? '/buyer/profile' : '/profile'}
                    onClick={() => setProfileMenuOpen(false)}
                    className="navbar-dropdown-item"
                  >
                    <User size={17} strokeWidth={2} />
                    <span>Mon profil</span>
                  </Link>

                  <div className="navbar-dropdown-divider" />

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    className="navbar-dropdown-item navbar-dropdown-item-danger"
                  >
                    <LogOut size={17} strokeWidth={2.2} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Hamburger Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-mobile-toggle"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Menu mobile connecté */}
      {menuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="navbar-mobile-user-card">
            <div className="navbar-dropdown-name">{user?.name || 'Utilisateur'}</div>
            {user?.email && <div className="navbar-dropdown-email">{user?.email}</div>}
          </div>

          <div className="navbar-mobile-search-wrapper">
            <NavbarSearchBar />
          </div>

          <nav className="navbar-mobile-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Catalogue
            </NavLink>
            <NavLink
              to={dashboardLink}
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              {isAdmin ? 'Tableau de bord Admin' : isSeller ? 'Espace Vendeur' : 'Mon espace'}
            </NavLink>
            <Link
              to={sellLink}
              className="navbar-mobile-link"
              style={{ color: '#4f46e5', fontWeight: 600 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Déposer une annonce
              </span>
            </Link>
            {isBuyer && (
              <NavLink
                to="/buyer/cart"
                className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
              >
                Mon panier {itemCount > 0 && <span className="navbar-mobile-badge">{itemCount}</span>}
              </NavLink>
            )}
            <NavLink
              to={messagesLink}
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Messages {unreadCount > 0 && <span className="navbar-mobile-badge">{unreadCount}</span>}
            </NavLink>
            <NavLink
              to={isBuyer ? '/buyer/profile' : '/profile'}
              className={({ isActive }) => `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
            >
              Mon profil
            </NavLink>
          </nav>

          <div className="navbar-mobile-divider" />

          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="navbar-mobile-btn-logout"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Déconnexion</span>
          </button>
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

  // Polling des messages non lus
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
        /* Header Sticky & Layout */
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.94);
          border-bottom-color: #e2e8f0;
          box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.08);
        }

        .navbar-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-sizing: border-box;
        }

        /* Logo */
        .navbar-logo-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .navbar-logo-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          transition: all 0.2s ease;
        }

        .navbar-logo-link:hover .navbar-logo-badge {
          border-color: #c7d2fe;
          box-shadow: 0 3px 12px rgba(99, 102, 241, 0.2);
          transform: scale(1.04);
        }

        .navbar-logo-img {
          width: 130%;
          height: 130%;
          object-fit: cover;
          display: block;
        }

        /* Groupes de gauche, centre et droite */
        .navbar-left-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .navbar-center-group {
          flex: 1;
          max-width: 480px;
          display: flex;
          align-items: center;
        }

        .navbar-right-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Desktop Nav Links */
        .navbar-desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .navbar-navlink {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          color: #475569;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          line-height: 1.3;
        }

        .navbar-navlink:hover {
          color: #0f172a;
          background: #f8fafc;
        }

        .navbar-navlink-active {
          color: #4f46e5 !important;
          background: #eef2ff !important;
          font-weight: 600 !important;
        }

        .navbar-role-badge {
          font-weight: 600;
        }

        /* Barre de Recherche Centrale Moderne */
        .navbar-search-form {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .navbar-search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .navbar-search-input {
          width: 100%;
          height: 38px;
          padding: 0 14px 0 38px;
          font-size: 13.5px;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          outline: none;
          transition: all 0.2s ease;
        }

        .navbar-search-input::placeholder {
          color: #94a3b8;
        }

        .navbar-search-input:focus {
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        /* Bouton Vendre (Action Vendeur Marketplace) */
        .navbar-btn-sell {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          text-decoration: none;
          transition: all 0.15s ease;
          line-height: 1.2;
        }

        .navbar-btn-sell:hover {
          background: #e0e7ff;
          border-color: #a5b4fc;
          color: #4338ca;
          transform: translateY(-1px);
        }

        /* Actions Auth Desktop */
        .navbar-auth-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Bouton Connexion */
        .navbar-btn-login {
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1.2;
        }

        .navbar-btn-login:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .navbar-btn-login-active {
          color: #4f46e5;
          background: #eef2ff;
        }

        /* Bouton S'inscrire */
        .navbar-btn-register {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          text-decoration: none;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1.2;
        }

        .navbar-btn-register:hover {
          background: linear-gradient(135deg, #4338ca, #4f46e5);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
          transform: translateY(-1px);
        }

        /* Boutons Icônes */
        .navbar-icon-btn {
          position: relative;
          padding: 8px;
          border-radius: 9px;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .navbar-icon-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .navbar-badge-pill {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 17px;
          height: 17px;
          border-radius: 99px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          line-height: 1;
        }

        .navbar-badge-cart {
          background: #4f46e5;
        }

        .navbar-badge-unread {
          background: #ef4444;
          animation: pulse 2s infinite;
        }

        /* Avatar Utilisateur */
        .navbar-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 99px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .navbar-avatar-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
        }

        /* Dropdown Card */
        .navbar-dropdown-card {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 240px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05);
          z-index: 100;
          overflow: hidden;
          transform-origin: top right;
          animation: fadeIn 0.15s ease;
        }

        .navbar-dropdown-header {
          padding: 14px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .navbar-dropdown-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-dropdown-email {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-dropdown-role {
          display: inline-flex;
          align-items: center;
          margin-top: 8px;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
        }

        .navbar-dropdown-body {
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .navbar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          color: #0f172a;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }

        .navbar-dropdown-item:hover {
          background: #f1f5f9;
          color: #4f46e5;
        }

        .navbar-dropdown-item-danger {
          color: #ef4444;
        }

        .navbar-dropdown-item-danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .navbar-dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 4px 6px;
        }

        /* Mobile Toggle SVG */
        .navbar-mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .navbar-mobile-toggle:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        /* Mobile Drawer */
        .navbar-mobile-drawer {
          border-top: 1px solid #f1f5f9;
          background: #ffffff;
          padding: 16px 20px 20px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
          animation: slideDown 0.2s ease-out;
        }

        .navbar-mobile-user-card {
          padding: 12px 14px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid #f1f5f9;
        }

        .navbar-mobile-search-wrapper {
          margin-bottom: 14px;
        }

        .navbar-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .navbar-mobile-link {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-mobile-link:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .navbar-mobile-link-active {
          background: #eef2ff !important;
          color: #4f46e5 !important;
          font-weight: 600 !important;
        }

        .navbar-mobile-badge {
          background: #4f46e5;
          color: #ffffff;
          border-radius: 99px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 700;
        }

        .navbar-mobile-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 14px 0;
        }

        .navbar-mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .navbar-mobile-btn-login {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          text-align: center;
          text-decoration: none;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.15s ease;
        }

        .navbar-mobile-btn-register {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
          text-decoration: none;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
          transition: all 0.15s ease;
        }

        .navbar-mobile-btn-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #ef4444;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .navbar-center-group {
            display: none;
          }
        }

        @media (max-width: 820px) {
          .navbar-desktop-nav {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: inline-flex !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}

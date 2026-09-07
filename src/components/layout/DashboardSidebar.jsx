import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { messageService } from '../../services/messageService';
import {
  Home,
  LayoutGrid,
  Package,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
  Heart,
  MessageSquare,
  User,
  Users,
  ShieldCheck,
  Tag,
  Folder,
  Send,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronDown
} from 'lucide-react';

// ── Icons SVG Lucide uniformes (18px / 2px stroke) ──
function SidebarIcon({ name, size = 18 }) {
  const iconMap = {
    'home': Home,
    'grid': LayoutGrid,
    'package': Package,
    'plus-circle': PlusCircle,
    'shopping-bag': ShoppingBag,
    'shopping-cart': ShoppingCart,
    'heart': Heart,
    'message-square': MessageSquare,
    'user': User,
    'users': Users,
    'shield': ShieldCheck,
    'tag': Tag,
    'folder': Folder,
    'send': Send,
    'bar-chart': BarChart3,
  };

  const IconComponent = iconMap[name] || Folder;
  return <IconComponent size={size} strokeWidth={2} style={{ flexShrink: 0 }} />;
}

export default function DashboardSidebar({ title, subtitle, accentColor = '#10b981', navItems }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('brevo_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('brevo_sidebar_collapsed', String(next));
      } catch {}
      return next;
    }
    );
  };

  useEffect(() => {
    const fetch = () => {
      messageService.getUnreadCount()
        .then(({ data }) => setUnread(data.count ?? data.unread_count ?? 0))
        .catch(() => {});
    };
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, []);

  const getRoleBadge = () => {
    const t = (title || '').toLowerCase();
    const sub = (subtitle || '').toLowerCase();
    if (user?.role === 'seller' || t.includes('vendeur') || sub.includes('vendeur')) return 'Vendeur';
    if (user?.role === 'admin' || t.includes('admin') || sub.includes('admin')) return 'Administrateur';
    return 'Acheteur';
  };

  return (
    <>
      {/* ── Desktop Sidebar (Ultra-Clean Light & Indigo Theme) ── */}
      <aside
        className="dashboard-sidebar"
        style={{
          width: collapsed ? 76 : 260,
          minWidth: collapsed ? 76 : 260,
          flexShrink: 0,
          position: 'sticky',
          top: 88,
          alignSelf: 'flex-start',
          height: 'fit-content',
          maxHeight: 'calc(100vh - 108px)',
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 30
        }}
      >
        {/* En-tête Utilisateur (Clean Card + Avatar Indigo Gradient + Badge Rôle) */}
        <div style={{
          padding: collapsed ? '18px 10px' : '18px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          background: '#ffffff',
          minHeight: 76
        }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 15,
                flexShrink: 0,
                boxShadow: '0 3px 10px rgba(79, 70, 229, 0.25)'
              }}>
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0f172a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.name || 'Utilisateur'}
                </div>
                {user?.email && (
                  <div style={{
                    fontSize: 11.5,
                    color: '#64748b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: 5
                  }}>
                    {user.email}
                  </div>
                )}
                <span style={{
                  display: 'inline-block',
                  background: '#eff6ff',
                  color: '#4f46e5',
                  border: '1px solid #dbeafe',
                  padding: '2px 10px',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.4
                }}>
                  {getRoleBadge()}
                </span>
              </div>
            </div>
          ) : (
            <div
              title={`${user?.name || ''} - ${getRoleBadge()}`}
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(79, 70, 229, 0.25)'
              }}
              onClick={toggleCollapsed}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            title={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}
            style={{
              background: 'transparent',
              border: '1px solid transparent',
              padding: 6,
              borderRadius: 8,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all .15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="brevo-sidebar-nav" style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item, idx) => (
            <SidebarItem
              key={item.to || item.label || idx}
              item={item}
              accentColor="#4f46e5"
              collapsed={collapsed}
              unread={item.label === 'Messages' || item.label === 'Messages globaux' ? unread : 0}
            />
          ))}
        </nav>

        {/* Footer Déconnexion */}
        <div style={{
          padding: collapsed ? '12px 8px' : '14px 16px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff'
        }}>
          {!collapsed ? (
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: '#f8fafc',
                color: '#475569',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all .15s',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <LogOut size={15} strokeWidth={2.2} />
              Déconnexion
            </button>
          ) : (
            <button
              onClick={logout}
              title="Déconnexion"
              style={{
                width: '100%',
                height: 38,
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all .15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <LogOut size={15} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Mobile Navigation (Ultra-Clean Light & Indigo Theme) ── */}
      <nav className="dashboard-mobile-nav" style={{
        display: 'none',
        gap: 6,
        overflowX: 'auto',
        padding: '6px 4px',
        marginBottom: 12,
        background: '#ffffff',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        WebkitOverflowScrolling: 'touch',
      }}>
        {navItems
          .filter(item => item.type !== 'section')
          .map((item, idx) => (
            <MobileSidebarItem
              key={item.to || idx}
              item={item}
              accentColor="#4f46e5"
              unread={item.label === 'Messages' || item.label === 'Messages globaux' ? unread : 0}
            />
          ))}
      </nav>
    </>
  );
}

// ── Item individuel / Section / Sous-menu (Dark Navy) ──
function SidebarItem({ item, accentColor, collapsed, unread = 0 }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some(ch =>
      location.pathname === ch.to || location.pathname.startsWith(ch.to + '/')
    );
  });

  if (item.type === 'section') {
    if (collapsed) {
      return (
        <div style={{
          height: 1,
          background: 'rgba(255, 255, 255, 0.08)',
          margin: '12px 6px',
        }} />
      );
    }
    return (
      <div style={{
        fontSize: 10.5,
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '16px 14px 6px 14px',
        userSelect: 'none'
      }}>
        {item.label}
      </div>
    );
  }

  if (item.children && item.children.length > 0) {
    const isParentOrChildActive =
      (item.to && (location.pathname === item.to || location.pathname.startsWith(item.to + '/'))) ||
      item.children.some(ch => location.pathname === ch.to || location.pathname.startsWith(ch.to + '/'));

    return (
      <div style={{ marginBottom: 4 }}>
        <div
          onClick={() => setOpen(!open)}
          className={`brevo-nav-link ${isParentOrChildActive ? 'active' : ''}`}
          style={{
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '12px 0' : '11px 14px',
            background: isParentOrChildActive ? '#eff6ff' : 'transparent',
            color: isParentOrChildActive ? '#4f46e5' : '#475569',
            fontWeight: isParentOrChildActive ? 700 : 500,
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={collapsed ? item.label : undefined}
          onMouseEnter={e => {
            if (!isParentOrChildActive) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = '#0f172a';
            }
          }}
          onMouseLeave={e => {
            if (!isParentOrChildActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#475569';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <SidebarIcon name={item.icon || 'folder'} size={20} />
            {!collapsed && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            )}
          </div>
          {!collapsed && (
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              style={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0
              }}
            />
          )}
        </div>

        {open && !collapsed && (
          <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', paddingLeft: 12 }}>
            {item.children.map(ch => {
              const active =
                location.pathname === ch.to ||
                (!ch.end && location.pathname.startsWith(ch.to + '/'));
              return (
                <NavLink
                  key={ch.to}
                  to={ch.to}
                  end={ch.end}
                  className={`brevo-sub-link ${active ? 'active' : ''}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 13,
                    color: active ? '#4f46e5' : '#64748b',
                    background: active ? '#eff6ff' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <span>{ch.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isItemActive = item.isActive
    ? item.isActive(null, location)
    : item.end
    ? location.pathname === item.to
    : location.pathname === item.to || location.pathname.startsWith(item.to + '/');

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={`brevo-nav-link ${isItemActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '12px 0' : '11px 14px',
        background: isItemActive ? '#eff6ff' : 'transparent',
        color: isItemActive ? '#4f46e5' : '#475569',
        fontWeight: isItemActive ? 700 : 500,
        borderRadius: 12,
        marginBottom: 4,
        textDecoration: 'none',
        position: 'relative',
        transition: 'all 0.15s ease'
      }}
      title={collapsed ? item.label : undefined}
      onMouseEnter={e => {
        if (!isItemActive) {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.color = '#0f172a';
        }
      }}
      onMouseLeave={e => {
        if (!isItemActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#475569';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        <SidebarIcon name={item.icon || 'folder'} size={20} />
        {!collapsed && (
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.label}
          </span>
        )}
      </div>

      {!collapsed && isItemActive && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', flexShrink: 0 }} />
      )}

      {unread > 0 && (
        <span style={{
          minWidth: 18,
          height: 18,
          borderRadius: 99,
          padding: '0 5px',
          background: '#ef4444',
          color: 'white',
          fontSize: 10,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: collapsed ? 'absolute' : 'relative',
          top: collapsed ? 4 : 'auto',
          right: collapsed ? 4 : 'auto'
        }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </NavLink>
  );
}

// ── Navigation Mobile (Ultra-Clean Light & Indigo Theme) ──
function MobileSidebarItem({ item, accentColor, unread = 0 }) {
  const location = useLocation();
  const isItemActive = item.isActive
    ? item.isActive(null, location)
    : item.end
    ? location.pathname === item.to
    : location.pathname === item.to || location.pathname.startsWith(item.to + '/');

  return (
    <NavLink
      to={item.to}
      end={item.end}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        borderRadius: 99,
        fontSize: 13,
        fontWeight: isItemActive ? 700 : 500,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        background: isItemActive ? '#eff6ff' : 'transparent',
        color: isItemActive ? '#4f46e5' : '#475569',
        border: `1px solid ${isItemActive ? '#dbeafe' : '#e2e8f0'}`,
        transition: 'all .15s',
        flexShrink: 0,
      }}
    >
      <SidebarIcon name={item.icon || 'folder'} size={16} />
      <span>{item.label}</span>
      {unread > 0 && (
        <span style={{
          minWidth: 16,
          height: 16,
          borderRadius: 99,
          padding: '0 4px',
          background: '#ef4444',
          color: 'white',
          fontSize: 10,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {unread}
        </span>
      )}
    </NavLink>
  );
}


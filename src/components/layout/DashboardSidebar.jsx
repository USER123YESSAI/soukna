import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { messageService } from '../../services/messageService';

// ── Icons SVG de style Brevo (Lucide 18px / 2px stroke) ──
function SidebarIcon({ name, size = 18 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { flexShrink: 0 }
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'package':
      return (
        <svg {...props}>
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'plus-circle':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case 'shopping-bag':
      return (
        <svg {...props}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case 'shopping-cart':
      return (
        <svg {...props}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'message-square':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'users':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...props}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'send':
      return (
        <svg {...props}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </>
              )}
            </svg>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
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


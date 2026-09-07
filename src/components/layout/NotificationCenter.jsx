import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import {
  Bell,
  CheckCheck,
  Trash2,
  RotateCcw,
  Package,
  Tag,
  MessageSquare,
  Info
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays} j`;
}

function getIconBadge(type) {
  switch (type) {
    case 'order':
      return {
        bg: '#eef2ff',
        color: '#6366f1',
        icon: <Package size={16} strokeWidth={2.2} />,
      };
    case 'promo':
      return {
        bg: '#fff7ed',
        color: '#f97316',
        icon: <Tag size={16} strokeWidth={2.2} />,
      };
    case 'message':
      return {
        bg: '#ecfdf5',
        color: '#10b981',
        icon: <MessageSquare size={16} strokeWidth={2.2} />,
      };
    default:
      return {
        bg: '#eff6ff',
        color: '#3b82f6',
        icon: <Info size={16} strokeWidth={2.2} />,
      };
  }
}

export default function NotificationCenter() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const list = notificationService.getNotifications(user);
      setNotifications(list);
    }
  }, [isAuthenticated, user, open]);

  if (!isAuthenticated || !user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (item) => {
    const updated = notificationService.markAsRead(user, item.id);
    setNotifications(updated);
    setOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead(user);
    setNotifications(updated);
  };

  const handleClearAll = () => {
    const updated = notificationService.clearAll(user);
    setNotifications(updated);
  };

  const handleReset = () => {
    const updated = notificationService.resetDefaults(user);
    setNotifications(updated);
  };

  return (
    <div style={{ position: 'relative' }} className="desktop-nav-item">
      {/* Bouton cloche avec badge dynamique */}
      <button
        onClick={() => setOpen(!open)}
        title="Centre de notifications"
        style={{
          position: 'relative',
          padding: 8,
          borderRadius: 10,
          color: '#475569',
          border: 'none',
          background: open ? '#f1f5f9' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
        className="icon-btn"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              minWidth: 18,
              height: 18,
              borderRadius: 99,
              background: '#ef4444',
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop de fermeture clic extérieur */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Popover Carte des notifications */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 330,
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow:
              '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
            zIndex: 100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* En-tête */}
          <div
            style={{
              padding: '14px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 99,
                  }}
                >
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#4f46e5',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: '2px 4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <CheckCheck size={14} />
                <span>Tout marquer lu</span>
              </button>
            )}
          </div>

          {/* Liste déroulante */}
          <div
            style={{
              maxHeight: 360,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              divideY: '1px solid #f1f5f9',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  color: '#64748b',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 99,
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <Bell size={22} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  Aucune notification pour le moment
                </span>
                <button
                  onClick={handleReset}
                  style={{
                    marginTop: 4,
                    border: 'none',
                    background: 'transparent',
                    color: '#6366f1',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Afficher les notifications de test
                </button>
              </div>
            ) : (
              notifications.map((item) => {
                const badge = getIconBadge(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      cursor: 'pointer',
                      background: item.read ? 'transparent' : '#f8fafc',
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = item.read ? 'transparent' : '#f8fafc';
                    }}
                  >
                    {/* Icône de statut */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: badge.bg,
                        color: badge.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {badge.icon}
                    </div>

                    {/* Contenu textuel */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: item.read ? 600 : 700,
                            color: '#0f172a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '3px 0 0',
                          fontSize: 12,
                          color: '#475569',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.message}
                      </p>
                    </div>

                    {/* Indicateur de non lu */}
                    {!item.read && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 99,
                          background: '#6366f1',
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pied de page du centre de notifications */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: '10px 16px',
                background: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={handleClearAll}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Trash2 size={13} />
                <span>Effacer l'historique</span>
              </button>
              <button
                onClick={handleReset}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#6366f1',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <RotateCcw size={13} />
                <span>Démo alertes</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

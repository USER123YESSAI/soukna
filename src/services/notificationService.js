/**
 * Service de gestion des notifications in-app pour Soukna
 * Gère l'historique persistent dans le localStorage par utilisateur et offre des notifications par défaut réalistes.
 */

const getStorageKey = (userId) => `soukna_notifications_${userId || 'guest'}`;

function getDefaultNotifications(role) {
  const now = Date.now();
  if (role === 'admin') {
    return [
      {
        id: 'adm-1',
        title: 'Activité Marketplace ⚡',
        message: '3 nouveaux utilisateurs se sont inscrits aujourd\'hui sur la plateforme.',
        type: 'system',
        link: '/admin/users',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 18).toISOString(),
      },
      {
        id: 'adm-2',
        title: 'Supervision des stocks',
        message: 'Certains produits du catalogue nécessitent une vérification des stocks.',
        type: 'order',
        link: '/admin/products',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'adm-3',
        title: 'Code Promo Actif 🎉',
        message: 'Le coupon SOUKNA20 est actuellement utilisé par les acheteurs.',
        type: 'promo',
        link: '/admin/coupons',
        read: true,
        createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
  }

  if (role === 'seller') {
    return [
      {
        id: 'sel-1',
        title: 'Nouvelle commande reçue ! 📦',
        message: 'Un acheteur vient de passer commande pour l\'un de vos articles.',
        type: 'order',
        link: '/seller',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
      },
      {
        id: 'sel-2',
        title: 'Conseil de vente ⭐',
        message: 'Ajoutez des descriptions détaillées et des photos de qualité pour augmenter vos ventes.',
        type: 'promo',
        link: '/seller/products',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: 'sel-3',
        title: 'Bienvenue sur votre espace Vendeur !',
        message: 'Votre boutique est en ligne. Commencez à publier vos produits.',
        type: 'system',
        link: '/seller',
        read: true,
        createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      },
    ];
  }

  // Acheteur (buyer par défaut)
  return [
    {
      id: 'buy-1',
      title: 'Commande en cours de préparation 📦',
      message: 'Votre dernière commande a été validée par le vendeur et est en préparation.',
      type: 'order',
      link: '/orders',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'buy-2',
      title: 'Code Promo Exclusif 🎉',
      message: 'Profitez de -15% de réduction sur tout le catalogue avec le code SOUKNA15.',
      type: 'promo',
      link: '/products',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'buy-3',
      title: 'Bienvenue sur Soukna ! ✨',
      message: 'Découvrez notre sélection de produits de qualité et profitez d\'une expérience de shopping fluide.',
      type: 'system',
      link: '/',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
}

export const notificationService = {
  getNotifications(user) {
    if (!user) return [];
    const key = getStorageKey(user.id);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // En cas d'erreur JSON, on réinitialise
      }
    }
    const role = user.role || 'buyer';
    const defaults = getDefaultNotifications(role);
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  },

  saveNotifications(user, notifications) {
    if (!user) return;
    const key = getStorageKey(user.id);
    localStorage.setItem(key, JSON.stringify(notifications));
  },

  markAsRead(user, notificationId) {
    const list = this.getNotifications(user);
    const updated = list.map(item =>
      item.id === notificationId ? { ...item, read: true } : item
    );
    this.saveNotifications(user, updated);
    return updated;
  },

  markAllAsRead(user) {
    const list = this.getNotifications(user);
    const updated = list.map(item => ({ ...item, read: true }));
    this.saveNotifications(user, updated);
    return updated;
  },

  addNotification(user, { title, message, type = 'system', link = '/' }) {
    const list = this.getNotifications(user);
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...list];
    this.saveNotifications(user, updated);
    return updated;
  },

  clearAll(user) {
    if (!user) return [];
    const key = getStorageKey(user.id);
    localStorage.removeItem(key);
    return [];
  },

  resetDefaults(user) {
    if (!user) return [];
    const role = user.role || 'buyer';
    const defaults = getDefaultNotifications(role);
    this.saveNotifications(user, defaults);
    return defaults;
  },
};

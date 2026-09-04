import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || API_URL.replace(/\/api\/?$/, '')).replace(/\/$/, '');

/** Convertit les URLs médias renvoyées par l'API en URL accessible et optimisée. */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  // Correction automatique des pages HTML ImgBB vers l'image directe
  const ibbMapping = {
    'https://ibb.co/Nd70kZY1': 'https://i.ibb.co/sdtTDy35/habit-homme.png',
    'https://ibb.co/VcnxGyzR': 'https://i.ibb.co/FLZX1vy2/chaussure-femme.png',
    'https://ibb.co/W4v51Vsw': 'https://i.ibb.co/nNMmSPRv/chaussure-homme.png',
    'https://ibb.co/Zp4RJ9TQ': 'https://i.ibb.co/pBV6PqXH/iphone17.png',
  };
  if (ibbMapping[url]) {
    return ibbMapping[url];
  }

  // Normalisation des fichiers stockés /storage/...
  // Qu'il s'agisse de "http://127.0.0.1:8000/storage/...", "/storage/..." ou "storage/..."
  const storageMatch = url.match(/(?:\/|^)storage\/(.+)$/);
  if (storageMatch) {
    const path = `/storage/${storageMatch[1]}`;
    // En dev, le proxy Vite redirige directement /storage vers le backend sans pénalité CORS
    if (import.meta.env.DEV) return path;
    // En prod, si l'URL est déjà une URL complète avec domaine valide (ex: Render), on la garde si ce n'est pas localhost
    if ((url.startsWith('http://') || url.startsWith('https://')) && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      return url;
    }
    return `${BACKEND_URL}${path}`;
  }

  // Si l'API renvoie directement une URL complète externe (ex: Cloudinary, Unsplash, ImgBB)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  return url;
}


export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let logoutCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasToken = !!localStorage.getItem('token');
    if (error.response?.status === 401 && logoutCallback && hasToken) {
      logoutCallback();
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  // Log en console pour faciliter le diagnostic en production / dev
  console.error('API Error:', error?.response || error);

  // 1. Erreur réseau / CORS / Serveur inaccessible (sans réponse HTTP)
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return "Impossible de joindre le serveur. Vérifiez que l'API est accessible et le CORS configuré.";
    }
    return error.message || 'Erreur de connexion au serveur.';
  }

  const { status, data } = error.response;

  // 2. Erreurs d'authentification et d'autorisation standards
  if (status === 401) {
    return 'Veuillez vous connecter pour effectuer cette action.';
  }
  if (status === 403) {
    return "Vous n'avez pas les droits pour effectuer cette action.";
  }
  if (status === 404) {
    return "Service introuvable (404). Vérifiez l'URL de l'API en production.";
  }
  if (status >= 500) {
    return `Erreur interne du serveur (${status}). Veuillez vérifier les logs backend.`;
  }

  // 3. Extraction du message renvoyé par l'API (JSON)
  if (typeof data === 'object' && data !== null) {
    if (data.message && data.message !== 'Unauthenticated.') {
      return data.message;
    }
    if (data.error) {
      return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    }
    if (data.errors) {
      const first = Object.values(data.errors)[0];
      return Array.isArray(first) ? first[0] : first;
    }
  }

  return `Une erreur est survenue (${status || 'Inconnue'}).`;
};

export const formatPrice = (price) => {
  const num = parseFloat(price);
  const val = Number.isNaN(num) ? 0 : num;
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(val) + ' FCFA';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

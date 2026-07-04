import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || API_URL.replace(/\/api\/?$/, '')).replace(/\/$/, '');

/** Convertit les URLs médias renvoyées par l'API en URL accessible. */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  // Si l'API renvoie directement une URL complète, on ne doit jamais la modifier.
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Normalisation /storage/... (chemin relatif)
  const storageMatch = url.match(/\/storage\/(.+)$/);
  if (storageMatch) {
    const path = `/storage/${storageMatch[1]}`;
    if (import.meta.env.DEV) return path;
    return `${BACKEND_URL}${path}`;
  }

  if (url.startsWith('/storage/')) {
    return `${BACKEND_URL}${url}`;
  }

  if (url.startsWith('storage/')) {
    return `${BACKEND_URL}/${url}`;
  }

  if (url.startsWith('http://localhost/') && BACKEND_URL.includes(':8000')) {
    return url.replace('http://localhost/', `${BACKEND_URL}/`);
  }

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
    if (error.response?.status === 401 && logoutCallback) {
      logoutCallback();
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.response?.status === 403) {
    return "Vous n'avez pas les droits pour effectuer cette action.";
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const first = Object.values(error.response.data.errors)[0];
    return Array.isArray(first) ? first[0] : first;
  }
  return 'Une erreur est survenue.';
};

export const formatPrice = (price) => {
  const num = parseFloat(price);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number.isNaN(num) ? 0 : num);
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

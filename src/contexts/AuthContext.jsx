import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { setLogoutCallback } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await authService.logout();
    } catch {
      /* ignore */
    } finally {
      clearAuth();
      toast.success('Déconnexion réussie');
    }
  }, [token, clearAuth]);

  useEffect(() => {
    setLogoutCallback(() => {
      const hadToken = !!localStorage.getItem('token');
      clearAuth();
      if (hadToken) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
      }
    });
  }, [clearAuth]);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.me();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, clearAuth]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success(data.message || 'Connexion réussie');
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success(data.message || 'Inscription réussie');
    return data.user;
  };

  const updateProfile = async (formData) => {
    const { data } = await authService.updateProfile(formData);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    toast.success(data.message || 'Profil mis à jour');
    return data.user;
  };

  const isAuthenticated = !!token && !!user;
  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isBuyer,
        isSeller,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

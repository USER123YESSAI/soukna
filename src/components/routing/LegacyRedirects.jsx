import { lazy, Suspense } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProfilePage = lazy(() => import('../../pages/ProfilePage'));

export function RedirectToBuyerOrders() {
  return <Navigate to="/buyer/orders" replace />;
}

export function RedirectToBuyerOrderDetail() {
  const { id } = useParams();
  return <Navigate to={`/buyer/orders/${id}`} replace />;
}

export function RedirectToBuyerFavorites() {
  return <Navigate to="/buyer/favorites" replace />;
}

export function RedirectToBuyerMessages() {
  const location = useLocation();
  return <Navigate to={`/buyer/messages${location.search}`} replace />;
}

export function RedirectToBuyerCart() {
  return <Navigate to="/buyer/cart" replace />;
}

export function ProfileRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user?.role === 'seller') {
    return (
      <ProtectedRoute roles={['seller']}>
        <Suspense fallback={<LoadingSpinner />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    );
  }
  return <Navigate to="/buyer/profile" replace />;
}

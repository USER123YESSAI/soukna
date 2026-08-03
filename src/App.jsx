import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import {
  RedirectToBuyerCart,
  RedirectToBuyerFavorites,
  RedirectToBuyerMessages,
  RedirectToBuyerOrderDetail,
  RedirectToBuyerOrders,
  ProfileRoute,
} from './components/routing/LegacyRedirects';
import HomePage from './pages/HomePage';
import RoleHomeRedirect from './components/routing/RoleHomeRedirect';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';

// Code-Splitting (React.lazy) pour les espaces connectés, vendeurs et administrateurs
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const SellerLayout = lazy(() => import('./components/layout/SellerLayout'));
const BuyerLayout = lazy(() => import('./components/layout/BuyerLayout'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const SellerDashboardPage = lazy(() => import('./pages/seller/SellerDashboardPage'));
const SellerProductsPage = lazy(() => import('./pages/seller/SellerProductsPage'));
const SellerProductFormPage = lazy(() => import('./pages/seller/SellerProductFormPage'));
const SellerOrdersPage = lazy(() => import('./pages/seller/SellerOrdersPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const BuyerDashboardPage = lazy(() => import('./pages/buyer/BuyerDashboardPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<Layout />}>

                  {/* ── Routes publiques (accessibles sans connexion) ── */}
                  <Route index element={<HomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />

                  {/* Catalogue public */}
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="search" element={<SearchPage />} />

                  {/* ── Routes authentifiées ── */}
                  <Route path="profile" element={<ProtectedRoute><ProfileRoute /></ProtectedRoute>} />
                  <Route path="cart" element={<ProtectedRoute><RedirectToBuyerCart /></ProtectedRoute>} />
                  <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><RedirectToBuyerOrders /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<ProtectedRoute><RedirectToBuyerOrderDetail /></ProtectedRoute>} />
                  <Route path="favorites" element={<ProtectedRoute><RedirectToBuyerFavorites /></ProtectedRoute>} />
                  <Route path="messages" element={<ProtectedRoute><RedirectToBuyerMessages /></ProtectedRoute>} />

                  {/* ── Espace acheteur ── */}
                  <Route path="buyer" element={<BuyerLayout />}>
                    <Route index element={<BuyerDashboardPage />} />
                    <Route path="catalogue" element={<ProductsPage basePath="/buyer/catalogue" />} />
                    <Route path="catalogue/:id" element={<ProductDetailPage basePath="/buyer/catalogue" />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />
                    <Route path="favorites" element={<FavoritesPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="cart" element={<CartPage />} />
                  </Route>

                  {/* ── Espace vendeur ── */}
                  <Route path="seller" element={<SellerLayout />}>
                    <Route index element={<SellerDashboardPage />} />
                    <Route path="catalogue" element={<ProductsPage basePath="/seller/catalogue" />} />
                    <Route path="catalogue/:id" element={<ProductDetailPage basePath="/seller/catalogue" />} />
                    <Route path="products" element={<SellerProductsPage />} />
                    <Route path="products/new" element={<SellerProductFormPage />} />
                    <Route path="products/:id/edit" element={<SellerProductFormPage />} />
                    <Route path="orders" element={<SellerOrdersPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                  </Route>

                  {/* ── Espace admin ── */}
                  <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="catalogue" element={<ProductsPage basePath="/admin/catalogue" />} />
                    <Route path="catalogue/:id" element={<ProductDetailPage basePath="/admin/catalogue" />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                  </Route>

                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
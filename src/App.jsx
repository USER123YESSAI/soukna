import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import SellerLayout from './components/layout/SellerLayout';
import BuyerLayout from './components/layout/BuyerLayout';
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
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerProductFormPage from './pages/seller/SellerProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import BuyerDashboardPage from './pages/buyer/BuyerDashboardPage';


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
                <Route path="products" element={<SellerProductsPage />} />
                <Route path="products/new" element={<SellerProductFormPage />} />
                <Route path="products/:id/edit" element={<SellerProductFormPage />} />
                <Route path="orders" element={<SellerOrdersPage />} />
                <Route path="messages" element={<MessagesPage />} />
              </Route>

              {/* ── Espace admin ── */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="messages" element={<MessagesPage />} />

              </Route>

            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </CartProvider>
    </AuthProvider>
  );
}
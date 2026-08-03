import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartService.get();
      setCart(data);
      localStorage.setItem('cart_count', String(data.items_count ?? data.items?.length ?? 0));
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [fetchCart, isAuthenticated]);

  const itemCount =
    cart?.items_count ??
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ??
    parseInt(localStorage.getItem('cart_count') || '0', 10);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter un produit au panier.');
      return;
    }
    try {
      const { data } = await cartService.add(productId, quantity);
      setCart(data.cart ?? data);
      toast.success('Produit ajouté au panier');
      await fetchCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateItem(cartItemId, quantity);
      await fetchCart();
      toast.success('Panier mis à jour');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartService.removeItem(cartItemId);
      await fetchCart();
      toast.success('Article retiré du panier');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clear();
      setCart(null);
      localStorage.setItem('cart_count', '0');
      toast.success('Panier vidé');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

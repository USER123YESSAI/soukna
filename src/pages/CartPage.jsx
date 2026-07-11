import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import { formatPrice } from '../services/api';

function CartContent() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const items = cart?.items || [];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Parcourez le catalogue pour ajouter des produits."
        action={
          <Link to="/products" className="text-indigo-600 hover:underline">
            Voir les produits
          </Link>
        }
      />
    );
  }

  const total = cart?.total ?? items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mon panier</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-red-600 hover:underline"
        >
          Vider le panier
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            {item.product?.image && (
              <ProductImage
                src={item.product.image}
                alt={item.product.title}
                className="h-20 w-20 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <Link to={`/products/${item.product?.id}`} className="font-medium hover:text-indigo-600">
                {item.product?.title}
              </Link>
              <p className="text-sm text-slate-500">{formatPrice(item.product?.effective_price)} / unité</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="rounded border px-2 py-1 text-sm"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="rounded border px-2 py-1 text-sm"
              >
                +
              </button>
            </div>
            {item.product?.quantity !== undefined && Number(item.product.quantity) < item.quantity && (
              <p className="text-xs font-semibold text-red-600">
                Stock insuffisant : disponible {item.product.quantity}
              </p>
            )}
            <p className="font-semibold text-indigo-600">{formatPrice(item.subtotal)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-indigo-600">{formatPrice(total)}</span>
        </div>
        <Link
          to="/checkout"
          className="mt-4 block w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Passer commande
        </Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}

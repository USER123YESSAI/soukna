import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatPrice } from '../services/api';

function CartContent() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const items = cart?.items || [];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <EmptyState
          title="Votre panier Soukna est vide"
          description="Parcourez notre catalogue et découvrez des milliers d'offres exceptionnelles."
          action={
            <Button to="/products" variant="primary" size="md">
              Explorer le catalogue →
            </Button>
          }
        />
      </div>
    );
  }

  const total = cart?.total ?? items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-4">
      <PageHeader
        title={`Mon Panier (${items.length})`}
        subtitle="Vérifiez vos articles avant de finaliser votre commande en toute sécurité"
        actions={
          <Button
            variant="danger"
            size="sm"
            onClick={clearCart}
            iconLeft={<span>🗑️</span>}
          >
            Vider le panier
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {item.product?.image ? (
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Link
                    to={`/products/${item.product?.id}`}
                    className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors line-clamp-1 no-underline"
                  >
                    {item.product?.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prix unitaire : <span className="font-semibold text-slate-700">{formatPrice(item.product?.price || item.unit_price)}</span>
                  </p>
                  {item.product?.seller && (
                    <p className="text-xs text-slate-400 mt-0.5">Vendeur : {item.product.seller.name}</p>
                  )}
                </div>

                {/* Sélecteur quantité et sous-total */}
                <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0 ml-auto">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right">
                    <p className="font-extrabold text-base text-slate-900">{formatPrice(item.subtotal)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer l'article"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar Résumé Sticky */}
        <div className="lg:col-span-1 sticky top-24">
          <Card className="p-6">
            <h2 className="text-lg font-extrabold text-slate-900 pb-4 border-b border-slate-100">
              Résumé de la commande
            </h2>

            <div className="space-y-3 py-4 border-b border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total ({items.length} articles)</span>
                <span className="font-semibold text-slate-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison standard</span>
                <span className="font-bold text-emerald-600">Gratuite</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-4">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-indigo-600">
                {formatPrice(total)}
              </span>
            </div>

            <Button
              to="/checkout"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Commander maintenant →
            </Button>

            {/* Badges de confiance */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Paiement 100% sécurisé et protégé</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🤝</span>
                <span>Garantie acheteur Soukna</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}

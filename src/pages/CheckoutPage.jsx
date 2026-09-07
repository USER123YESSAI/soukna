import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { formatPrice, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Lock, CheckCircle2 } from 'lucide-react';


function CheckoutForm() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const items = cart?.items || [];
  const total = cart?.total ?? items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        ...data,
        payment_method: paymentMethod,
      };

      const { data: res } = await orderService.create(orderPayload);
      await fetchCart();
      toast.success(res.message || 'Commande créée avec succès');
      navigate(`/buyer/orders/${res.order.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClasses = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <PageHeader
        title="Paiement & Livraison"
        subtitle="Finalisez votre commande en toute sécurité avec notre garantie acheteur 100% protégée."
        backTo="/buyer/cart"
        backLabel="Retour au panier"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Columns (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Bloc Adresse */}
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-base font-bold text-slate-900">1. Adresse de livraison</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Indiquez où vous souhaitez recevoir votre colis</p>
                </div>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div>
                  <label className={labelClasses}>Adresse complète *</label>
                  <input
                    {...register('shipping_address', { required: 'Adresse requise' })}
                    placeholder="Numéro, rue, quartier..."
                    className={inputClasses}
                  />
                  {errors.shipping_address && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.shipping_address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Ville *</label>
                    <input
                      {...register('shipping_city', { required: 'Ville requise' })}
                      placeholder="Ex: Paris, Lyon, N'Djamena..."
                      className={inputClasses}
                    />
                    {errors.shipping_city && (
                      <p className="mt-1 text-xs font-semibold text-rose-600">{errors.shipping_city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Code postal *</label>
                    <input
                      {...register('shipping_postal_code', { required: 'Code postal requis' })}
                      placeholder="Ex: 75001"
                      className={inputClasses}
                    />
                    {errors.shipping_postal_code && (
                      <p className="mt-1 text-xs font-semibold text-rose-600">{errors.shipping_postal_code.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Numéro de téléphone *</label>
                  <input
                    {...register('shipping_phone', { required: 'Téléphone requis' })}
                    placeholder="Ex: +33 6 12 34 56 78"
                    className={inputClasses}
                  />
                  {errors.shipping_phone && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.shipping_phone.message}</p>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Bloc Options & Notes */}
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-base font-bold text-slate-900">2. Options & Instructions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Précisions utiles pour le livreur ou code avantage</p>
                </div>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div>
                  <label className={labelClasses}>Code promotionnel</label>
                  <input
                    {...register('coupon_code')}
                    placeholder="Ex: PROMO10"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Instructions de livraison (optionnel)</label>
                  <textarea
                    rows={3}
                    {...register('notes')}
                    placeholder="Digicode, étage, consignes particulières pour la dépose..."
                    className={`${inputClasses} resize-y`}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Mode de Paiement */}
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Mode de paiement sécurisé</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Transactions chiffrées SSL 256 bits et vérification 3D Secure</p>
                </div>
              </Card.Header>
              <Card.Body className="space-y-3">
                {/* Carte bancaire */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method_radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-bold text-slate-900">Carte bancaire (Visa / Mastercard / CB)</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 text-slate-600 rounded">CB</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 text-slate-600 rounded">VISA</span>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-indigo-100 space-y-3">
                      <div>
                        <label className={labelClasses}>Numéro de carte</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8910"
                          maxLength={19}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClasses}>Expiration</label>
                          <input
                            type="text"
                            placeholder="MM / AA"
                            maxLength={5}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">PayPal</span>
                      <span className="text-xs text-slate-500">Paiement au comptant ou en 4x sans frais.</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Pay */}
                <div
                  onClick={() => setPaymentMethod('mobile_pay')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'mobile_pay'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'mobile_pay'}
                      onChange={() => setPaymentMethod('mobile_pay')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Apple Pay / Google Pay</span>
                      <span className="text-xs text-slate-500">Règlement instantané via vos appareils configurés.</span>
                    </div>
                  </div>
                </div>

                {/* Paiement à la livraison */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Paiement à la livraison</span>
                      <span className="text-xs text-slate-500">Réglez directement en mains propres auprès du transporteur.</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar Récapitulatif (4 or 5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <Card>
              <Card.Header>
                <h2 className="text-base font-bold text-slate-900">Récapitulatif de commande</h2>
              </Card.Header>
              <Card.Body className="space-y-4">
                {/* Liste des articles */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs shrink-0">
                          {it.quantity}x
                        </span>
                        <span className="font-medium text-slate-700 truncate">{it.product?.title}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">{formatPrice(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total ({items.length} articles)</span>
                    <span className="font-semibold text-slate-900">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Livraison prioritaire</span>
                    <span className="font-bold text-emerald-600">Offerte</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total TTC</span>
                  <span className="text-2xl font-extrabold text-indigo-600">{formatPrice(total)}</span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  iconLeft={<Lock size={16} />}
                  className="w-full font-bold shadow-lg shadow-indigo-600/25 mt-2"
                >
                  Confirmer et payer
                </Button>

                <div className="pt-4 border-t border-dashed border-slate-200 space-y-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> <span>Garantie 100% Satisfait ou Remboursé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> <span>Cryptage sécurisé SSL 256 bits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> <span>Expédition express sous 24/48h</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute roles={['buyer', 'admin']}>
      <CheckoutForm />
    </ProtectedRoute>
  );
}

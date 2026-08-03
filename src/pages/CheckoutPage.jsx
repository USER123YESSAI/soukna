import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { formatPrice, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

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

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid var(--border)',
    fontSize: 14,
    background: '#f8fafc',
    color: '#0f172a',
    outline: 'none',
    transition: 'all .15s',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 6
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', marginBottom: 8 }}>
          <Link to="/buyer/cart" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Panier</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Finaliser ma commande</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Paiement & Livraison Soukna
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
          Toutes les transactions sont cryptées et protégées par notre garantie acheteur.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36 }}>
          {/* Formulaire de livraison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Bloc Adresse */}
            <div style={{
              background: 'white', borderRadius: 24, border: '1px solid var(--border)',
              padding: '28px', boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                Adresse de livraison
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Adresse complète *</label>
                  <input
                    {...register('shipping_address', { required: 'Adresse requise' })}
                    placeholder="Numéro, rue, quartier..."
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                  />
                  {errors.shipping_address && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{errors.shipping_address.message}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Ville *</label>
                    <input
                      {...register('shipping_city', { required: 'Ville requise' })}
                      placeholder="Ex: N'Djamena, Abéché..."
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                    />
                    {errors.shipping_city && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{errors.shipping_city.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Code postal *</label>
                    <input
                      {...register('shipping_postal_code', { required: 'Code postal requis' })}
                      placeholder="Ex: 00000"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                    />
                    {errors.shipping_postal_code && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{errors.shipping_postal_code.message}</p>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Numéro de téléphone *</label>
                  <input
                    {...register('shipping_phone', { required: 'Téléphone requis' })}
                    placeholder="Ex: +235 / +33 ..."
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                  />
                  {errors.shipping_phone && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{errors.shipping_phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Code promo & Notes */}
            <div style={{
              background: 'white', borderRadius: 24, border: '1px solid var(--border)',
              padding: '28px', boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                Options & Code promo
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Code promotionnel Soukna</label>
                  <input
                    {...register('coupon_code')}
                    placeholder="Ex: SOUKNA10"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Instructions spéciales (optionnel)</label>
                  <textarea
                    rows={3}
                    {...register('notes')}
                    placeholder="Instructions de livraison, étage, digicode..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              </div>
            </div>

            {/* Sélecteur de Mode de Paiement (SSL / 3D Secure, PayPal, Apple Pay, à la livraison) */}
            <div style={{
              background: 'white', borderRadius: 24, border: '1px solid var(--border)',
              padding: '28px', boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                Mode de paiement sécurisé
              </h2>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
                Toutes les transactions sont 100% cryptées par SSL 256 bits et vérifiées par protocole 3D Secure.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Option 1: Carte bancaire */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 14,
                    padding: '16px 20px', borderRadius: 16,
                    border: paymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: paymentMethod === 'card' ? '#eff6ff' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input
                        type="radio"
                        name="payment_method_radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        style={{ width: 18, height: 18, accentColor: '#2563eb' }}
                      />
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>
                        Carte bancaire (Visa / Mastercard / CB)
                      </span>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4, borderTop: '1px solid #bfdbfe', paddingTop: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8910"
                          maxLength={19}
                          style={{ ...inputStyle, background: 'white' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                            Date d&apos;expiration
                          </label>
                          <input
                            type="text"
                            placeholder="MM / AA"
                            maxLength={5}
                            style={{ ...inputStyle, background: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                            Code de sécurité (CVV)
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            style={{ ...inputStyle, background: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 2: PayPal */}
                <label
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: 16,
                    border: paymentMethod === 'paypal' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: paymentMethod === 'paypal' ? '#eff6ff' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      style={{ width: 18, height: 18, accentColor: '#2563eb' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, display: 'block' }}>
                        PayPal (Comptant ou 4x sans frais)
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        Redirection sécurisée vers PayPal à l&apos;étape suivante.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Option 3: Apple Pay / Google Pay */}
                <label
                  onClick={() => setPaymentMethod('mobile_pay')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: 16,
                    border: paymentMethod === 'mobile_pay' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: paymentMethod === 'mobile_pay' ? '#eff6ff' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'mobile_pay'}
                      onChange={() => setPaymentMethod('mobile_pay')}
                      style={{ width: 18, height: 18, accentColor: '#2563eb' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, display: 'block' }}>
                        Apple Pay / Google Pay
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        Paiement mobile instantané en 1 clic.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Option 4: Paiement à la livraison */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: 16,
                    border: paymentMethod === 'cod' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: paymentMethod === 'cod' ? '#eff6ff' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="radio"
                      name="payment_method_radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ width: 18, height: 18, accentColor: '#2563eb' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, display: 'block' }}>
                        Paiement à la livraison
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        Réglez en espèces ou par carte directement au livreur.
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar Récapitulatif commande */}
          <div style={{ flex: '0 0 380px' }}>
            <div style={{
              borderRadius: 24, border: '1px solid var(--border)', background: 'white',
              padding: '28px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 90
            }}>
              <h2 style={{ margin: '0 0 18px', fontSize: 19, fontWeight: 800, color: '#0f172a' }}>
                Récapitulatif commande
              </h2>

              {/* Aperçu des articles */}
              <div style={{
                maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column',
                gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 18, marginBottom: 18
              }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '2px 8px', borderRadius: 99 }}>
                        {it.quantity}x
                      </span>
                      <span style={{ color: '#334155', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {it.product?.title}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>
                      {formatPrice(it.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 18, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                  <span>Articles ({items.length})</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatPrice(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                  <span>Livraison express</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>Gratuit</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Total à payer</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#4f46e5' }}>
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: '100%', padding: '16px 0', borderRadius: 99,
                  fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1, border: 'none',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {submitting ? 'Traitement en cours...' : 'Confirmer & Payer la commande'}
              </button>

              {/* Badges de sécurité & Confiance Soukna */}
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  Garantie 100% Satisfait ou Remboursé sous 14 jours
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  Cryptage SSL 256 bits & 3D Secure vérifié
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  Expédition prioritaire 24/48h & Suivi colis
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  Support Client Soukna disponible 7j/7
                </div>

                {/* Logos modes de paiement */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  {['VISA', 'Mastercard', 'CB', 'PayPal', 'Apple Pay'].map((logo) => (
                    <span
                      key={logo}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#64748b',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '3px 8px',
                        borderRadius: 6,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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

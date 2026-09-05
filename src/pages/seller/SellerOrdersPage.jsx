import { useEffect, useState } from 'react';
import { sellerService } from '../../services/sellerService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import InlineChat from '../../components/messages/InlineChat';
import { formatPrice, formatDate, getErrorMessage } from '../../services/api';
import { exportToCsv } from '../../utils/csvExporter';
import toast from 'react-hot-toast';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChats, setOpenChats] = useState({}); // { orderId: true/false }

  useEffect(() => {
    sellerService
      .getOrders()
      .then(({ data }) => setOrders(data.data || data.orders || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCsv = () => {
    if (!orders.length) return;
    const headers = ['N° Commande', 'Date', 'Acheteur', 'Statut', 'Montant (FCFA)', 'Mode Paiement', 'Statut Paiement'];
    const rows = orders.map(o => [
      o.order_number,
      o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '',
      o.buyer?.name || 'Inconnu',
      o.status,
      o.total_amount,
      o.payment_method || 'N/A',
      o.payment_status || 'pending',
    ]);
    exportToCsv(`commandes_vendeur_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success('Export CSV généré avec succès !');
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success('Statut mis à jour');
      const { data } = await sellerService.getOrders();
      setOrders(data.data || data.orders || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleChat = (orderId) => {
    setOpenChats(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Commandes reçues</h1>
        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            📥 Exporter en CSV
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-slate-500">Aucune commande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                  {order.buyer && (
                    <p className="text-xs text-slate-400 mt-1">
                      Acheteur : {order.buyer.name}
                    </p>
                  )}
                </div>
                <StatusBadge status={order.status} />
                <p className="font-bold text-indigo-600">{formatPrice(order.total_amount)}</p>
              </div>

              {/* Statut paiement */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>Paiement : <strong>{order.payment_method === 'card' ? 'Carte bancaire' : order.payment_method === 'paypal' ? 'PayPal' : order.payment_method === 'mobile_pay' ? 'Wave/OM' : order.payment_method === 'cod' ? 'À la livraison' : (order.payment_method || 'N/A')}</strong></span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['confirmed', 'shipped', 'delivered'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(order.id, s)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    {s}
                  </button>
                ))}

                {/* Bouton contacter l'acheteur */}
                {order.buyer && (
                  <button
                    type="button"
                    onClick={() => toggleChat(order.id)}
                    style={{
                      padding: '4px 12px', borderRadius: 8,
                      border: '1.5px solid #6366f1',
                      background: openChats[order.id] ? '#eef2ff' : 'white',
                      color: '#6366f1', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
                    onMouseLeave={e => { if (!openChats[order.id]) e.currentTarget.style.background = 'white'; }}
                  >
                    💬 Contacter {order.buyer.name}
                  </button>
                )}
              </div>

              {/* Chat inline avec l'acheteur */}
              {openChats[order.id] && order.buyer && (
                <div style={{ marginTop: 12 }}>
                  <InlineChat
                    recipientId={order.buyer.id}
                    recipientName={order.buyer.name}
                    title={`💬 Discussion avec ${order.buyer.name}`}
                    maxHeight={280}
                    accentColor="#6366f1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return <SellerOrders />;
}

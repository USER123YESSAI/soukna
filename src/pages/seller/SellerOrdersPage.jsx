import { useEffect, useState } from 'react';
import { sellerService } from '../../services/sellerService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import InlineChat from '../../components/messages/InlineChat';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
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
      <PageHeader
        title="Commandes reçues"
        subtitle="Consultez et préparez les commandes passées sur votre boutique"
        actions={
          orders.length > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportCsv}
              iconLeft={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Exporter en CSV
            </Button>
          )
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title="Aucune commande pour le moment"
          description="Les commandes passées par les acheteurs apparaîtront ici."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-base">{order.order_number}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(order.created_at)}</p>
                  {order.buyer && (
                    <p className="text-xs font-medium text-slate-600 mt-1">
                      Acheteur : <span className="text-slate-900 font-semibold">{order.buyer.name}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-indigo-600">{formatPrice(order.total_amount)}</p>
                  <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-slate-500">
                    <span>{order.payment_method === 'card' ? 'Carte bancaire' : order.payment_method === 'paypal' ? 'PayPal' : order.payment_method === 'mobile_pay' ? 'Mobile Money' : 'À la livraison'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Changer statut :</span>
                  {[
                    { key: 'confirmed', label: 'Confirmer' },
                    { key: 'shipped', label: 'Expédier' },
                    { key: 'delivered', label: 'Livrer' },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(order.id, key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {order.buyer && (
                  <Button
                    variant={openChats[order.id] ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={() => toggleChat(order.id)}
                    iconLeft={
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                  >
                    Contacter l'acheteur
                  </Button>
                )}
              </div>

              {/* Chat direct vendeur-acheteur */}
              {openChats[order.id] && order.buyer && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <InlineChat
                    receiverId={order.buyer.id}
                    receiverName={order.buyer.name}
                    orderNumber={order.order_number}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return <SellerOrders />;
}

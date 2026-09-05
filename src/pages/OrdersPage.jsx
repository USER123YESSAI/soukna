import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { formatPrice, formatDate, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '',          label: 'Tous les statuts' },
  { value: 'pending',   label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped',   label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (status) params.status = status;
    orderService
      .getMyOrders(params)
      .then(({ data }) => {
        setOrders(data.data || data.orders || []);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div>
      <PageHeader
        title="Mes commandes"
        subtitle="Historique de vos achats et suivi d'acheminement de vos colis en direct"
        actions={
          <div className="w-48">
            <Select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          description={status ? `Aucune commande avec le statut "${STATUS_OPTIONS.find(o => o.value === status)?.label}".` : 'Vos commandes apparaîtront ici dès que vous aurez validé un panier.'}
        />
      ) : (
        <>
          <div className="space-y-3.5">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/buyer/orders/${order.id}`}
                className="block no-underline"
              >
                <Card hoverable className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <p className="font-bold text-base text-slate-900">
                          {order.order_number ?? `#${order.id}`}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-base text-indigo-600">
                        {formatPrice(order.total_amount)}
                      </p>
                      {order.payment_method && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.payment_method === 'card' ? 'Carte bancaire' : order.payment_method === 'paypal' ? 'PayPal' : order.payment_method === 'mobile_pay' ? 'Mobile Money' : 'À la livraison'}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        {order.items[0]?.product?.title ? ` · ${order.items[0].product.title}${order.items.length > 1 ? '…' : ''}` : ''}
                      </span>
                      <span className="font-semibold text-indigo-600 flex items-center gap-1">
                        Détails & Facture →
                      </span>
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>

          {pagination && (
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <OrdersList />;
}

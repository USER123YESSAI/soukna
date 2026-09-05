import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('published');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    productService
      .getAll({ page, status: status || undefined })
      .then(({ data }) => {
        setProducts(data.data || []);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, status]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setUpdating(true);
    try {
      await adminService.updateProductStatus(selectedProductId, selectedStatus);
      toast.success('Statut du produit mis à jour avec succès');
      setSelectedProductId('');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm('Suppression définitive de ce produit ? Cette action est irréversible.')) return;
    try {
      await adminService.forceDeleteProduct(id);
      toast.success('Produit supprimé définitivement');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Modération des produits"
        subtitle="Examinez les produits soumis par les vendeurs, modifiez leur visibilité ou supprimez les articles non conformes"
      />

      {/* Filtres */}
      <div className="mb-5 max-w-xs">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Tous les statuts ({pagination?.total ?? '...'})</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié (En ligne)</option>
          <option value="sold">Vendu</option>
          <option value="inactive">Inactif</option>
        </Select>
      </div>

      {/* Liste des produits */}
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Aucun produit trouvé"
          description={status ? `Aucun article avec le statut "${status}".` : 'Aucun produit dans le catalogue pour le moment.'}
        />
      ) : (
        <>
          <Card padding={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Produit</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Prix</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Vendeur</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Statut</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {p.image ? (
                              <ProductImage src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">IMG</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                            <p className="text-xs text-slate-400 font-normal">ID #{p.id} · Stock: {p.quantity ?? 1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatPrice(p.price)}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.seller?.name || '—'}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={p.status} /></td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => { setSelectedProductId(p.id); setSelectedStatus(p.status); }}
                          >
                            Statut
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleForceDelete(p.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {pagination && (
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Modal / Card de modification de statut */}
      {selectedProductId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-slate-200 animate-fade-in">
            <Card.Header
              title="Modifier le statut du produit"
              subtitle={`Mise à jour de la visibilité pour l'article #${selectedProductId}`}
            />
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <Select
                label="Nouveau statut :"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="draft">Brouillon (Non visible)</option>
                <option value="published">Publié (En ligne sur le catalogue)</option>
                <option value="sold">Vendu</option>
                <option value="inactive">Inactif (Désactivé par admin)</option>
              </Select>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setSelectedProductId('')}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  loading={updating}
                >
                  Appliquer la modification
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return <AdminProducts />;
}

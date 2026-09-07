import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';


function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = () => {
    setLoading(true);
    const params = status ? { status } : {};
    productService
      .getMyProducts(params)
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      toast.success('Produit supprimé avec succès');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.category?.name?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const TABS = [
    { value: '', label: 'Tous les produits' },
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'sold', label: 'Vendus / Épuisés' },
  ];

  return (
    <div>
      <PageHeader
        title="Mes produits"
        subtitle="Gérez et suivez le stock de vos articles mis en vente sur Soukna"
        actions={
          <Button
            to="/seller/products/new"
            variant="primary"
            size="md"
            iconLeft={<Plus size={16} strokeWidth={2.5} />}

          >
            Nouveau produit
          </Button>
        }
      />

      {/* Barre de filtres par statut + recherche */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Onglets statut */}
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search size={16} className="text-slate-400" />}
          />
        </div>
      </div>

      {/* Tableau des produits */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit trouvé'}
          description={searchQuery ? 'Essayez avec d\'autres termes ou retirez le filtre.' : 'Commencez par ajouter votre premier article en vente.'}
        />
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Produit</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Catégorie</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Prix</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Statut</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {p.image ? (
                            <ProductImage src={p.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-xs text-slate-400 font-normal">Réf: #{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {p.category?.name || 'Général'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        p.quantity > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {p.quantity > 0 ? `${p.quantity} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          to={`/seller/products/${p.id}/edit`}
                          variant="secondary"
                          size="sm"
                          iconLeft={<Pencil size={13} />}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          iconLeft={<Trash2 size={13} />}
                          onClick={() => handleDelete(p.id)}
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
      )}
    </div>
  );
}

export default function SellerProductsPage() {
  return <SellerProducts />;
}

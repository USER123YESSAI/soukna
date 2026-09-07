import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { type: 'percent', is_active: 'true' },
  });
  const couponType = watch('type');

  const load = () => {
    setLoading(true);
    adminService
      .getCoupons()
      .then(({ data }) => setCoupons(data.data || data.coupons || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        is_active: data.is_active === true || data.is_active === 'true',
        value: parseFloat(data.value),
        usage_limit: data.usage_limit ? parseInt(data.usage_limit, 10) : null,
        min_order_total: data.min_order_total ? parseFloat(data.min_order_total) : null,
      };
      if (editing) {
        await adminService.updateCoupon(editing.id, payload);
        toast.success('Code promo mis à jour');
      } else {
        await adminService.createCoupon(payload);
        toast.success('Code promo créé avec succès');
      }
      reset({ type: 'percent', is_active: 'true' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setShowForm(true);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      starts_at: coupon.starts_at?.slice(0, 16) || '',
      ends_at: coupon.ends_at?.slice(0, 16) || '',
      usage_limit: coupon.usage_limit || '',
      min_order_total: coupon.min_order_total || '',
      is_active: coupon.is_active ? 'true' : 'false',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce code promo ?')) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success('Code promo supprimé');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Gestion des coupons"
        subtitle="Créez et configurez des codes promotionnels (réductions fixes ou en pourcentage)"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditing(null);
              } else {
                setShowForm(true);
                setEditing(null);
                reset({ type: 'percent', is_active: 'true' });
              }
            }}
            iconLeft={showForm ? <X size={15} /> : <Plus size={15} strokeWidth={2.5} />}
          >
            {showForm ? 'Fermer le formulaire' : 'Nouveau coupon'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 shadow-md border-indigo-100 bg-indigo-50/20">
          <Card.Header
            title={editing ? `Modifier le coupon : ${editing.code}` : 'Créer un nouveau coupon de réduction'}
            subtitle="Renseignez la valeur, les conditions et les dates de validité"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Code Promo *"
                placeholder="Ex: PROMO2025"
                error={errors.code?.message}
                {...register('code', { required: 'Le code est requis' })}
              />

              <Select
                label="Type de remise"
                error={errors.type?.message}
                {...register('type')}
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </Select>

              <Input
                label={`Valeur (${couponType === 'percent' ? '%' : 'FCFA'}) *`}
                type="number"
                step="0.01"
                placeholder={couponType === 'percent' ? 'Ex: 10' : 'Ex: 2000'}
                error={errors.value?.message}
                {...register('value', { required: 'La valeur est requise', min: { value: 0.01, message: 'Doit être > 0' } })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Montant minimum d'achat (FCFA)"
                type="number"
                placeholder="Optionnel, ex: 10000"
                {...register('min_order_total')}
              />

              <Input
                label="Limite globale d'utilisations"
                type="number"
                placeholder="Optionnel, ex: 100"
                {...register('usage_limit')}
              />

              <Input
                label="Date d'expiration"
                type="date"
                {...register('ends_at')}
              />
            </div>

            <div className="max-w-xs">
              <Select
                label="Statut du coupon"
                {...register('is_active')}
              >
                <option value="true">Actif (Utilisable immédiatement)</option>
                <option value="false">Inactif (Désactivé)</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                iconLeft={<X size={15} />}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={submitting}
                iconLeft={<Check size={15} />}
              >
                {editing ? 'Mettre à jour le coupon' : 'Enregistrer le coupon'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : coupons.length === 0 ? (
        <EmptyState
          title="Aucun code promotionnel"
          description="Créez votre premier coupon de réduction pour booster les ventes."
        />
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Code</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Remise</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Validité</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Statut</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {c.value} {c.type === 'percent' ? '%' : 'FCFA'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {c.ends_at ? `Expire le ${formatDate(c.ends_at)}` : 'Illimité'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(c)}
                          iconLeft={<Pencil size={13} />}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                          iconLeft={<Trash2 size={13} />}
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

export default function AdminCouponsPage() {
  return <AdminCoupons />;
}

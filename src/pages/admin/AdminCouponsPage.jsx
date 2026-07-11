import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'percent', is_active: true },
  });

  const load = () => {
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
        toast.success('Coupon mis à jour');
      } else {
        await adminService.createCoupon(payload);
        toast.success('Coupon créé');
      }
      reset({ type: 'percent', is_active: true });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
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
      is_active: coupon.is_active,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce coupon ?')) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success('Coupon supprimé');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des coupons</h1>
        <button
          type="button"
          onClick={() => { setShowForm(!showForm); setEditing(null); reset({ type: 'percent', is_active: true }); }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {showForm ? 'Annuler' : '+ Nouveau coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Code</label>
            <input {...register('code', { required: 'Requis' })} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select {...register('type')} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="percent">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Valeur</label>
            <input type="number" step="0.01" {...register('value', { required: 'Requis' })} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Commande min.</label>
            <input type="number" step="0.01" {...register('min_order_total')} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Début</label>
            <input type="datetime-local" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} {...register('starts_at')} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Expiration</label>
            <input type="datetime-local" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} {...register('ends_at')} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Limite d&apos;usage</label>
            <input type="number" {...register('usage_limit')} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Actif</label>
            <select {...register('is_active')} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
              {editing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Valeur</th>
                <th className="p-3">Expiration</th>
                <th className="p-3">Actif</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="">
                  <td className="p-3 font-mono font-medium">{c.code}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.value}{c.type === 'percent' ? '%' : '€'}</td>
                  <td className="p-3">{formatDate(c.ends_at)}</td>
                  <td className="p-3">{c.is_active ? 'Oui' : 'Non'}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => handleEdit(c)} className="mr-2 text-indigo-600 hover:underline">Modifier</button>
                    <button type="button" onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminCouponsPage() {
  return <AdminCoupons />;
}

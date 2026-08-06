import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: 'published', quantity: 1 },
  });

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getAll()
      .then(({ data }) => {
        const payload = data?.data ?? data;
        if (!cancelled) setCategories(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productService
      .getById(id)
      .then(({ data }) => {
        reset({
          title: data.title,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          category_id: data.category?.id,
          status: data.status,
          image_url: data.image && (data.image.startsWith('http://') || data.image.startsWith('https://')) ? data.image : '',
          sale_price: data.sale_price || '',
          sale_starts_at: data.sale_starts_at?.slice(0, 16) || '',
          sale_ends_at: data.sale_ends_at?.slice(0, 16) || '',
        });
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (key === 'image' || key === 'images') return;
        formData.append(key, value);
      });
      if (data.image?.[0]) formData.append('image', data.image[0]);
      if (data.images) {
        const files = Array.from(data.images);
        const maxImages = 10;
        if (files.length > maxImages) {
          toast.error(`Trop d’images (max ${maxImages}). Seules les ${maxImages} premières seront envoyées.`);
        }
        files.slice(0, maxImages).forEach((file) => formData.append('images[]', file));
      }

      if (isEdit) {
        await productService.update(id, formData);
        toast.success('Produit mis à jour');
      } else {
        if (!data.image?.[0]) {
          toast.error('Image principale requise');
          setSubmitting(false);
          return;
        }
        await productService.create(formData);
        toast.success('Produit créé');
      }
      navigate('/seller/products');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Modifier le produit' : 'Nouveau produit'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Titre</label>
          <input {...register('title', { required: 'Requis' })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea rows={4} {...register('description', { required: 'Requis' })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Prix (FCFA)</label>
            <input type="number" step="1" {...register('price', { required: 'Requis', min: 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Stock</label>
            <input type="number" {...register('quantity', { min: 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Catégorie</label>
          <select {...register('category_id', { required: 'Requis' })} className="w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="">Choisir...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Statut</label>
          <select {...register('status')} className="w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        {!isEdit && (
          <div>
            <label className="mb-1 block text-sm font-medium">Image principale *</label>
            <input type="file" accept="image/*" {...register('image')} className="w-full text-sm" />
          </div>
        )}
        {isEdit && (
          <div>
            <label className="mb-1 block text-sm font-medium">Modifier l'image principale (optionnel)</label>
            <input type="file" accept="image/*" {...register('image')} className="w-full text-sm" />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium">Images supplémentaires</label>
          <input type="file" accept="image/*" multiple {...register('images')} className="w-full text-sm" />
        </div>
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-medium">Promotion flash (optionnel)</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-slate-500">Prix promo</label>
              <input type="number" step="0.01" {...register('sale_price')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Début</label>
              <input type="datetime-local" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} {...register('sale_starts_at')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Fin</label>
              <input type="datetime-local" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} {...register('sale_ends_at')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
          </div>
        </fieldset>
        <button type="submit" disabled={submitting} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
          {submitting ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
        </button>
      </form>
    </div>
  );
}

export default function SellerProductFormPage() {
  return <ProductForm />;
}

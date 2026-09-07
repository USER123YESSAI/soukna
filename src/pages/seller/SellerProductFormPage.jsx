import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getErrorMessage } from '../../services/api';
import { compressImage, compressImages } from '../../utils/imageCompressor';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';


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
      if (data.image?.[0]) {
        const compressedMain = await compressImage(data.image[0]);
        formData.append('image', compressedMain);
      }
      if (data.images) {
        const files = Array.from(data.images);
        const maxImages = 10;
        if (files.length > maxImages) {
          toast.error(`Trop d’images (max ${maxImages}). Seules les ${maxImages} premières seront envoyées.`);
        }
        const compressedExtras = await compressImages(files.slice(0, maxImages));
        compressedExtras.forEach((file) => formData.append('images[]', file));
      }

      if (isEdit) {
        await productService.update(id, formData);
        toast.success('Produit mis à jour avec succès');
      } else {
        if (!data.image?.[0]) {
          toast.error('Image principale requise');
          setSubmitting(false);
          return;
        }
        await productService.create(formData);
        toast.success('Produit créé avec succès');
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
    <div className="mx-auto max-w-3xl py-4">
      <PageHeader
        title={isEdit ? 'Modifier le produit' : 'Créer un nouveau produit'}
        subtitle="Renseignez les détails, prix, catégorie et photos de votre article"
        backTo="/seller/products"
        backLabel="Retour aux produits"
      />

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Titre de l'article *"
            placeholder="Ex: Sneakers Nike Air Max Édition Limitée"
            error={errors.title?.message}
            {...register('title', { required: 'Le titre du produit est requis' })}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description complète *
            </label>
            <textarea
              rows={4}
              placeholder="Décrivez précisément l'état, les fonctionnalités, les dimensions..."
              {...register('description', { required: 'La description est requise' })}
              className="w-full p-3.5 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Prix unitaire (FCFA) *"
              type="number"
              step="1"
              placeholder="Ex: 25000"
              error={errors.price?.message}
              {...register('price', { required: 'Le prix est requis', min: { value: 0, message: 'Min. 0' } })}
            />

            <Input
              label="Quantité en stock *"
              type="number"
              placeholder="Ex: 10"
              error={errors.quantity?.message}
              {...register('quantity', { required: 'Le stock est requis', min: { value: 0, message: 'Min. 0' } })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Catégorie de produit *"
              error={errors.category_id?.message}
              {...register('category_id', { required: 'Veuillez sélectionner une catégorie' })}
            >
              <option value="">Sélectionnez un univers...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>

            <Select
              label="Statut de publication"
              {...register('status')}
            >
              <option value="published">Publié (Directement visible aux acheteurs)</option>
              <option value="draft">Brouillon (Non visible)</option>
            </Select>
          </div>

          {/* Photos */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Photos de l'article</h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isEdit ? "Remplacer l'image principale (Optionnel)" : "Image principale du produit *"}
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('image')}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Images secondaires (Optionnel - jusqu'à 10 photos)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                {...register('images')}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Promotion flash */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Promotion flash (Optionnel)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Prix réduit (FCFA)"
                type="number"
                step="0.01"
                placeholder="Ex: 19900"
                {...register('sale_price')}
              />

              <Input
                label="Début de promo"
                type="datetime-local"
                {...register('sale_starts_at')}
              />

              <Input
                label="Fin de promo"
                type="datetime-local"
                {...register('sale_ends_at')}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="md"
              to="/seller/products"
              iconLeft={<X size={15} />}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              iconLeft={<Check size={15} />}
            >
              {isEdit ? 'Mettre à jour le produit' : 'Publier le produit'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function SellerProductFormPage() {
  return <ProductForm />;
}

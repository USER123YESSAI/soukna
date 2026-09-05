import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { getErrorMessage } from '../../services/api';
import { adminCategoryService } from '../../services/adminCategoryService';
import { getCategoryIcon } from '../../utils/categoryIcons';

function safeTrim(v) {
  return typeof v === 'string' ? v.trim() : v;
}

function normalizeIcon(icon) {
  const v = safeTrim(icon);
  return v === '' ? null : v;
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [q, setQ] = useState('');
  const [pagination, setPagination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
    },
  });

  const watchedName = watch('name');

  useEffect(() => {
    if (!showForm) return;
    if (editing) return;
    const currentSlug = safeTrim(watch('slug') ?? '');
    if (currentSlug) return;
    const base = safeTrim(watchedName ?? '');
    if (!base) return;
    const proposed = base
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (proposed) reset({
      name: base,
      slug: proposed,
      description: watch('description') ?? '',
      icon: watch('icon') ?? '',
    }, { keepErrors: true, keepDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedName]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminCategoryService.getCategories({
        page,
        per_page: perPage,
        q: safeTrim(q) || undefined,
      });
      setCategories(data?.data ?? data?.categories ?? []);
      setPagination(data?.pagination ?? null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
    reset({ name: '', slug: '', description: '', icon: '' });
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setShowForm(true);
    reset({
      name: cat.name ?? '',
      slug: cat.slug ?? '',
      description: cat.description ?? '',
      icon: cat.icon ?? '',
    });
  };

  const onSubmit = async (formValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: safeTrim(formValues.name),
        slug: safeTrim(formValues.slug) || null,
        description: safeTrim(formValues.description) || null,
        icon: normalizeIcon(formValues.icon),
      };

      if (editing) {
        await adminCategoryService.updateCategory(editing.id, payload);
        toast.success('Catégorie mise à jour');
      } else {
        await adminCategoryService.createCategory(payload);
        toast.success('Catégorie créée');
      }

      setShowForm(false);
      setEditing(null);
      reset({ name: '', slug: '', description: '', icon: '' });
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await adminCategoryService.deleteCategory(id);
      toast.success('Catégorie supprimée');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        title="Gestion des catégories"
        subtitle="Organisez et structurez les rayons et univers de produits du catalogue Soukna"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => { setShowForm(true); openCreate(); }}
            iconLeft={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Nouvelle catégorie
          </Button>
        }
      />

      {/* Barre de recherche */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom ou slug..."
            iconLeft={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {pagination?.total ?? categories.length} catégorie(s) au total
        </div>
      </div>

      {/* Formulaire Modal/Card d'ajout ou d'édition */}
      {showForm && (
        <Card className="mb-6 shadow-md border-indigo-100 bg-indigo-50/20">
          <Card.Header
            title={editing ? `Modifier la catégorie : ${editing.name}` : 'Créer une nouvelle catégorie'}
            subtitle="Renseignez les détails du rayon"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nom de la catégorie *"
                placeholder="Ex: Électronique & Informatique"
                error={errors.name?.message}
                {...register('name', { required: 'Le nom est requis' })}
              />

              <Input
                label="Slug URL (Optionnel)"
                placeholder="automatique si vide"
                error={errors.slug?.message}
                {...register('slug')}
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description (Optionnelle)
              </label>
              <textarea
                {...register('description')}
                rows={2}
                placeholder="Courte description affichée aux acheteurs..."
                className="w-full p-3 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
              />
            </div>

            <Input
              label="Icône ou Émoji (Optionnel)"
              placeholder="Ex: 📱 ou 💻"
              error={errors.icon?.message}
              {...register('icon')}
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={submitting}
              >
                {editing ? 'Mettre à jour' : 'Créer la catégorie'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tableau des catégories */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="Aucune catégorie trouvée"
          description={q ? `Aucune catégorie ne correspond à "${q}".` : 'Commencez par ajouter votre première catégorie.'}
        />
      ) : (
        <>
          <Card padding={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Catégorie</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Slug URL</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Produits associés</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl shrink-0 shadow-2xs">
                            {getCategoryIcon(c)}
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{c.slug}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          {c.products_count ?? 0} article(s)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[280px] truncate">{c.description || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEdit(c)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(c.id)}
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
    </div>
  );
}

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { getErrorMessage } from '../../services/api';
import { adminCategoryService } from '../../services/adminCategoryService';

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

  // Petite aide UI: proposer un slug si l'utilisateur n'en met pas
  useEffect(() => {
    if (!showForm) return;
    if (editing) {
      // Pendant édition: on ne force pas.
      return;
    }
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

  const filteredCountText = useMemo(() => {
    if (!pagination?.total) return '0 résultat';
    const t = pagination.total;
    return t === 1 ? '1 résultat' : `${t} résultats`;
  }, [pagination?.total]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des catégories</h1>
          <p className="mt-1 text-sm text-slate-600">CRUD complet avec recherche, pagination et validation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setShowForm(false); openCreate(); }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Nouvelle catégorie
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom ou slug..."
            className="w-full rounded-lg border px-3 py-2 text-sm sm:w-72"
          />
        </div>
        <div className="text-sm text-slate-600">{filteredCountText}</div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium">Nom *</label>
            <input
              {...register('name', { required: 'Nom requis' })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Slug (optionnel)</label>
            <input
              {...register('slug')}
              placeholder="automatique si vide"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Optionnel"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Icône (optionnel)</label>
            <input
              {...register('icon')}
              placeholder="Ex: 📱 ou URL"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); reset({ name: '', slug: '', description: '', icon: '' }); }}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {editing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-slate-500">Aucune catégorie trouvée.</p>
      ) : (
        <div className="rounded-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Produits</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {c.icon ? (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg border bg-slate-50 text-lg"
                            aria-label="icon"
                          >
                            {c.icon}
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-slate-50 text-slate-400">—</div>
                        )}
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-700">{c.slug}</td>
                    <td className="p-3">{c.products_count ?? 0}</td>
                    <td className="p-3 text-slate-600 max-w-[280px] truncate">{c.description || '—'}</td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="text-indigo-600 hover:underline text-xs font-semibold"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className="text-red-600 hover:underline text-xs font-semibold"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-4">
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}


import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage, resolveMediaUrl } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { Camera, Check } from 'lucide-react';


function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(() => resolveMediaUrl(user?.profile_image));

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      city: user?.city || '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.bio) formData.append('bio', data.bio);
      if (data.phone) formData.append('phone', data.phone);
      if (data.city) formData.append('city', data.city);
      if (data.profile_image?.[0]) {
        formData.append('profile_image', data.profile_image[0]);
      }
      await updateProfile(formData);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel = {
    admin: 'Administrateur',
    seller: 'Vendeur Certifié',
    buyer: 'Acheteur',
  }[user?.role] || user?.role;

  return (
    <div className="max-w-2xl mx-auto py-4">
      <PageHeader
        title="Mon profil"
        subtitle="Gérez vos informations personnelles et vos coordonnées de livraison"
      />

      <Card className="p-6 sm:p-8">
        {/* En-tête profil avec avatar */}
        <div className="flex flex-wrap items-center gap-5 pb-6 mb-6 border-b border-slate-100">
          <div className="relative group">
            {preview ? (
              <img
                src={preview}
                alt={user?.name || 'Avatar'}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-2xl font-extrabold text-indigo-600 shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-xl shadow cursor-pointer transition-transform group-hover:scale-110 flex items-center justify-center"
              title="Changer la photo"
            >
              <Camera size={14} />
            </label>
          </div>

          <div className="flex-1 min-w-[200px]">
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {roleLabel}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            {...register('profile_image', {
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              },
            })}
          />

          <Input
            label="Nom complet"
            error={errors.name?.message}
            {...register('name', { required: 'Le nom est requis' })}
          />

          <div className="w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Biographie
            </label>
            <textarea
              rows={3}
              placeholder="Présentez-vous en quelques mots..."
              {...register('bio')}
              className="w-full p-3.5 text-sm bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              placeholder="+221 77 000 00 00"
              {...register('phone')}
            />

            <Input
              label="Ville"
              placeholder="Ex: Dakar"
              {...register('city')}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              iconLeft={<Check size={16} />}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileForm />;
}

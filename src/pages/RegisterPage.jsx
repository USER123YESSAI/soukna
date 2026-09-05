import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'buyer' } });

  const password = watch('password');
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
        phone: data.phone || undefined,
        city: data.city || undefined,
      };
      await registerUser(payload);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 px-4">
      <Card className="p-8 sm:p-10 shadow-lg border-slate-200">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-sm shadow-indigo-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Créer un compte
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom complet"
            placeholder="Ex: Amadou Diallo"
            error={errors.name?.message}
            {...register('name', { required: 'Le nom complet est requis' })}
          />

          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            error={errors.email?.message}
            {...register('email', { required: 'L\'adresse email est requise' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Mot de passe requis',
                minLength: { value: 6, message: 'Min. 6 caractères' },
              })}
            />

            <Input
              label="Confirmation"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              {...register('password_confirmation', {
                required: 'Confirmation requise',
                validate: (v) => v === password || 'Mots de passe différents',
              })}
            />
          </div>

          <Select
            label="Je souhaite rejoindre en tant que :"
            error={errors.role?.message}
            helperText={selectedRole === 'seller' ? 'Vous pourrez publier et vendre vos produits.' : 'Vous pourrez acheter et commander des produits.'}
            {...register('role')}
          >
            <option value="buyer">Acheteur (Commander des produits)</option>
            <option value="seller">Vendeur (Vendre sur la plateforme)</option>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Téléphone (optionnel)"
              placeholder="+221 77 000 00 00"
              {...register('phone')}
            />

            <Input
              label="Ville (optionnel)"
              placeholder="Ex: Dakar"
              {...register('city')}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full"
            >
              Créer mon compte Soukna →
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            En vous inscrivant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité.
          </p>
        </form>
      </Card>
    </div>
  );
}

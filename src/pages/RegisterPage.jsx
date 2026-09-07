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
import { ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';


export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'buyer', terms_accepted: false } });

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
        terms_accepted: data.terms_accepted,
        terms_version: '1.0',
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
          <Link to="/" className="inline-block group mb-3">
            <img
              src="/soukna-logo.jpg"
              alt="Soukna Logo"
              className="w-16 h-16 rounded-2xl mx-auto shadow-md shadow-indigo-100 border border-slate-200 object-cover group-hover:scale-105 transition-transform"
            />
          </Link>
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
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors cursor-pointer shrink-0"
                {...register('terms_accepted', {
                  required: 'Vous devez accepter les Conditions d\'utilisation et la Politique de confidentialité pour vous inscrire.',
                })}
              />
              <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                J&apos;accepte les{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Conditions d&apos;utilisation
                </a>{' '}
                et la{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Politique de confidentialité
                </a>
                .
              </span>
            </label>
            {errors.terms_accepted && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                <AlertCircle size={14} className="shrink-0" />
                {errors.terms_accepted.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              iconRight={<ArrowRight size={16} />}
              className="w-full"
            >
              Créer mon compte Soukna
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

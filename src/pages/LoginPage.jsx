import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      const role = user?.role;
      const target = role === 'admin' ? '/admin' : role === 'seller' ? '/seller' : '/buyer';
      navigate(target, { replace: true });
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error('Compte suspendu. Contactez le support.');
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto my-10 px-4">
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
            Connexion
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            error={errors.email?.message}
            {...register('email', { required: 'L\'adresse email est requise' })}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Le mot de passe est requis' })}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full"
            >
              Se connecter →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

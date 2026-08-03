import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
    transition: 'border-color .15s', background: 'white', boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: 440, margin: '40px auto' }}>
      {/* Card */}
      <div style={{ background: 'white', borderRadius: 24, border: '1.5px solid var(--border)', padding: '40px', boxShadow: 'var(--shadow)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Connexion</h1>
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Inscrivez-vous</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <input type="email" {...register('email', { required: 'Email requis' })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border)'}
            />
            {errors.email && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Mot de passe</label>
            <input type="password" {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Min. 6 caractères' } })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : 'var(--border)'}
            />
            {errors.password && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'inherit',
            background: submitting ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,.4)',
            transition: 'all .2s'
          }}>
            {submitting ? 'Connexion en cours...' : 'Se connecter →'}
          </button>
        </form>
      </div>
    </div>
  );
}

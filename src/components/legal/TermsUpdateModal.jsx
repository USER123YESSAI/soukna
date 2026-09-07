import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, FileText, ExternalLink, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function TermsUpdateModal() {
  const { user, acceptTerms } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // If user is not logged in or does not require re-acceptance, do not display
  if (!user || !user.requires_terms_acceptance) {
    return null;
  }

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await acceptTerms('1.0');
    } catch (err) {
      toast.error('Une erreur est survenue lors de l\'acceptation des conditions.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 relative">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5 text-indigo-600">
          <ShieldCheck size={26} strokeWidth={2.2} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Mise à jour des Conditions d'utilisation
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          Nous avons récemment mis à jour nos <strong>Conditions d'utilisation</strong> et notre <strong>Politique de confidentialité</strong> (version 1.0) afin de mieux protéger vos droits, clarifier les obligations sur la marketplace et garantir la sécurité de vos données personnelles.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Consulter les documents à jour
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex-1"
            >
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-600" />
                Conditions d'utilisation
              </span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>

            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex-1"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Politique de confidentialité
              </span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={submitting}
            onClick={handleAccept}
            iconLeft={<Check size={16} />}
            className="w-full sm:w-auto"
          >
            Accepter et continuer
          </Button>
        </div>
      </div>
    </div>
  );
}

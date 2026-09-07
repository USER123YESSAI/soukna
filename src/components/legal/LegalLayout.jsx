import { NavLink } from 'react-router-dom';
import { FileText, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalLayout({
  title,
  subtitle,
  version = '1.0',
  lastUpdated = '7 septembre 2026',
  children,
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Navigation retour & Bouton impression */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all hover:border-slate-300"
          title="Imprimer ce document"
        >
          <Printer size={16} className="text-slate-500" />
          Imprimer le document
        </button>
      </div>

      {/* En-tête principal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <span>Version {version}</span>
            <span>•</span>
            <span>Dernière mise à jour : {lastUpdated}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Onglets de navigation entre Conditions et Confidentialité */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-100 print:hidden">
          <NavLink
            to="/terms"
            className={({ isActive }) =>
              `inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`
            }
          >
            <FileText size={18} />
            Conditions d'utilisation
          </NavLink>

          <NavLink
            to="/privacy"
            className={({ isActive }) =>
              `inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`
            }
          >
            <ShieldCheck size={18} />
            Politique de confidentialité
          </NavLink>
        </div>
      </div>

      {/* Contenu du document légal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 shadow-sm prose prose-slate max-w-none">
        {children}
      </div>
    </div>
  );
}

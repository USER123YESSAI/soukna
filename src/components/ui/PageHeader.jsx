import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * En-tête de page universel pour tous les espaces (Admin, Vendeur, Acheteur, etc.)
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  backTo,
  backLabel = 'Retour',
  actions,
  className = '',
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline mb-3 transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          <span>{backLabel}</span>
        </Link>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

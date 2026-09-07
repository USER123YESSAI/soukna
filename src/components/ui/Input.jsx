import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';


/**
 * Champ de saisie universel avec label, gestion d'erreur et icônes
 */
const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  id,
  type = 'text',
  disabled = false,
  ...props
}, ref) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {iconLeft}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`
            w-full h-11 px-3.5 text-sm bg-white text-slate-900 placeholder-slate-400
            rounded-xl border transition-all duration-150 outline-none
            ${iconLeft ? 'pl-10' : ''}
            ${iconRight ? 'pr-10' : ''}
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
            }
            ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''}
            ${className}
          `}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
            {iconRight}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

export default Input;

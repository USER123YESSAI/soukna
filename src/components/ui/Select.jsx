import { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';


/**
 * Menu déroulant universel avec flèche SVG personnalisée et gestion d'erreur
 */
const Select = forwardRef(function Select({
  label,
  error,
  helperText,
  options = [],
  children,
  className = '',
  id,
  disabled = false,
  ...props
}, ref) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`
            w-full h-11 pl-3.5 pr-10 text-sm bg-white text-slate-900 appearance-none
            rounded-xl border transition-all duration-150 outline-none cursor-pointer
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
            }
            ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''}
            ${className}
          `}
          {...props}
        >
          {children ? children : options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>

        {/* Flèche chevron SVG */}
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
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

export default Select;

import { Link } from 'react-router-dom';

/**
 * Bouton universel standardisé pour le Design System Soukna
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  className = '',
  onClick,
  style,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none cursor-pointer text-center no-underline border';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2 text-sm gap-2 rounded-xl min-h-[40px]',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-xl min-h-[46px]',
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border-transparent shadow-sm hover:shadow active:scale-[0.99]',
    secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-xs',
    dark: 'bg-slate-900 hover:bg-slate-800 active:bg-black text-white border-transparent shadow-sm active:scale-[0.99]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 active:scale-[0.99]',
    dangerSolid: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border-transparent shadow-sm active:scale-[0.99]',
    outline: 'bg-transparent hover:bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400 active:scale-[0.99]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent',
  };

  const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const classes = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${disabledStyles} ${className}`.trim();

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && iconLeft && <span className="shrink-0 flex items-center">{iconLeft}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className="shrink-0 flex items-center">{iconRight}</span>}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} style={style} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} style={style} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      style={style}
      {...props}
    >
      {content}
    </button>
  );
}

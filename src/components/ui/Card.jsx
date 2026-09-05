/**
 * Carte de surface standardisée pour le Design System Soukna
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = true,
  style,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-slate-200/80 shadow-xs
        ${padding ? 'p-6' : ''}
        ${hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300' : ''}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', actions, title, subtitle }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 ${className}`}>
      <div>
        {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        {!title && !subtitle && children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
};

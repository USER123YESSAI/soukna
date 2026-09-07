import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page } = pagination;

  const pages = [];
  const start = Math.max(1, current_page - 2);
  const end = Math.min(last_page, current_page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={current_page <= 1}
        onClick={() => onPageChange(current_page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        <span>Précédent</span>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            page === current_page
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={current_page >= last_page}
        onClick={() => onPageChange(current_page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <span>Suivant</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}


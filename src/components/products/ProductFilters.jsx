export default function ProductFilters({ filters, categories, onChange }) {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid var(--border)',
    fontSize: 14,
    outline: 'none',
    background: '#f8fafc',
    color: '#0f172a',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 6
  };

  const hasActiveFilters =
    filters.search ||
    filters.category_id ||
    filters.min_price ||
    filters.max_price ||
    filters.in_stock ||
    filters.on_sale ||
    (filters.sort && filters.sort !== 'newest');

  const handleReset = () => {
    onChange({
      search: '',
      category_id: '',
      min_price: '',
      max_price: '',
      in_stock: false,
      on_sale: false,
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 24,
      border: '1px solid rgba(226, 232, 240, 0.9)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 20
      }}>
        {/* Recherche */}
        <div style={{ gridColumn: 'span 2 / span 2', minWidth: 240 }}>
          <label style={labelStyle}>
            Recherche
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Rechercher par nom, marque ou description..."
              style={{ ...inputStyle, paddingRight: 32 }}
              onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
            />
            {filters.search && (
              <button
                onClick={() => onChange({ search: '' })}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: '#e2e8f0', color: '#64748b',
                  width: 20, height: 20, borderRadius: 99, fontSize: 11,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Effacer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label style={labelStyle}>
            Catégorie
          </label>
          <select
            value={filters.category_id || ''}
            onChange={(e) => onChange({ category_id: e.target.value })}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prix min */}
        <div>
          <label style={labelStyle}>
            Prix min (FCFA)
          </label>
          <input
            type="number"
            min="0"
            value={filters.min_price || ''}
            onChange={(e) => onChange({ min_price: e.target.value })}
            placeholder="0"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
          />
        </div>

        {/* Prix max */}
        <div>
          <label style={labelStyle}>
            Prix max (FCFA)
          </label>
          <input
            type="number"
            min="0"
            value={filters.max_price || ''}
            onChange={(e) => onChange({ max_price: e.target.value })}
            placeholder="Max"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
          />
        </div>

        {/* Tri */}
        <div>
          <label style={labelStyle}>
            Trier par
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onChange({ sort: e.target.value })}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; }}
          >
            <option value="newest">Plus récents</option>
            <option value="popular">Plus populaires</option>
            <option value="cheapest">Moins chers d&apos;abord</option>
            <option value="most_rated">Mieux notés</option>
          </select>
        </div>
      </div>

      {/* Toggles rapides & bouton de réinitialisation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderTop: '1px solid #f1f5f9',
        paddingTop: 16
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!filters.in_stock}
              onChange={(e) => onChange({ in_stock: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            En stock uniquement
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!filters.on_sale}
              onChange={(e) => onChange({ on_sale: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            Promotions uniquement
          </label>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}

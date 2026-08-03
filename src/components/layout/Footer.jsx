import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'white', marginTop: 80, color: '#0f172a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 36px' }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gap: 64,
            marginBottom: 44
          }}
        >
          {/* Marque */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Soukna<span style={{ color: '#4f46e5' }}>.</span>
            </span>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/', label: 'Accueil' },
                { to: '/products', label: 'Catalogue des produits' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  style={{ fontSize: 14, color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#4f46e5'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de pied de page minimaliste */}
        <div
          className="footer-bottom"
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <span style={{ fontSize: 13, color: '#64748b' }}>
            © {currentYear} Soukna. Tous droits réservés.
          </span>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#64748b' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color = '#0f172a'} onMouseLeave={e => e.target.style.color = '#64748b'}>
              Confidentialité
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color = '#0f172a'} onMouseLeave={e => e.target.style.color = '#64748b'}>
              Conditions d&apos;utilisation
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color = '#0f172a'} onMouseLeave={e => e.target.style.color = '#64748b'}>
              Sécurité SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

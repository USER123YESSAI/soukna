import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/soukna-icon.jpg"
              alt="Soukna Logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                objectFit: 'cover',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.12)',
              }}
            />
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

          {/* Légal */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Informations Légales
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/terms', label: 'Conditions d\'utilisation' },
                { to: '/privacy', label: 'Politique de confidentialité' },
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
            <Link
              to="/privacy"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#0f172a'}
              onMouseLeave={e => e.target.style.color = '#64748b'}
            >
              Politique de confidentialité
            </Link>
            <Link
              to="/terms"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#0f172a'}
              onMouseLeave={e => e.target.style.color = '#64748b'}
            >
              Conditions d&apos;utilisation
            </Link>
            <span>
              Sécurité SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

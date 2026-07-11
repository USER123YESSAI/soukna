import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CATEGORY_ICONS = ['🎧', '👗', '💻', '🏠', '📱', '👟', '📚', '🎮'];

export default function HomePage() {
  const { isAuthenticated, user, isSeller, isAdmin } = useAuth();
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getTopSelling ? productService.getTopSelling(8) : productService.getAll({ sort: 'popular', per_page: 8 }),
      categoryService.getAll(),
    ]).then(([productsRes, categoriesRes]) => {
      setTopProducts(productsRes.data?.data ?? []);
      setCategories(categoriesRes.data?.data ?? categoriesRes.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Si connecté → afficher accueil personnalisé selon rôle
  if (isAuthenticated) {
    const dashLink = isAdmin ? '/admin' : isSeller ? '/seller' : '/buyer';
    const dashLabel = isAdmin ? 'Tableau de bord Admin' : isSeller ? 'Espace Vendeur' : 'Mon espace';
    return (
      <div>
        {/* Bienvenue personnalisée */}
        <section style={{
          borderRadius: 20, padding: '40px 48px', marginBottom: 40,
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          color: 'white', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(139,92,246,.2)', filter: 'blur(50px)' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Bienvenue 👋</p>
            <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.3px' }}>
              Bonjour, {user?.name?.split(' ')[0]} !
            </h1>
            <p style={{ margin: '0 0 24px', color: '#c4b5fd', fontSize: 15 }}>
              {isAdmin ? 'Gérez la plateforme depuis votre tableau de bord.' : isSeller ? 'Consultez vos ventes et gérez vos produits.' : 'Découvrez les derniers produits disponibles.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to={dashLink} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: 'white', color: '#4f46e5', textDecoration: 'none' }}>
                {dashLabel} →
              </Link>
              <Link to="/products" style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, border: '1.5px solid rgba(255,255,255,.3)', color: 'white', textDecoration: 'none' }}>
                Parcourir le catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* Catégories */}
        {categories.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Catégories</h2>
              <Link to="/products" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.slice(0, 8).map((cat, i) => (
                <Link key={cat.id} to={`/products?category_id=${cat.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                  borderRadius: 10, background: 'white', border: '1.5px solid var(--border)',
                  textDecoration: 'none', color: '#334155', fontSize: 13, fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)', transition: 'all .15s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#334155'; }}>
                  <span>{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</span>{cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top produits */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Meilleures ventes</h2>
            <Link to="/products" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner size="lg" /></div>
            : topProducts.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}><div style={{ fontSize: 40, marginBottom: 8 }}>📦</div><p style={{ margin: 0 }}>Aucun produit pour le moment.</p></div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {topProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
          }
        </section>
      </div>
    );
  }

  // ── Page publique (non connecté) ──
  return (
    <div>
      {/* Hero */}
      <section style={{
        borderRadius: 24, overflow: 'hidden', marginBottom: 56,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
        padding: '72px 56px', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(139,92,246,.25)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(99,102,241,.25)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 580 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,.12)', color: '#c4b5fd', marginBottom: 24, border: '1px solid rgba(255,255,255,.15)' }}>
            ✦ Marketplace EPF Africa 
            
          </span>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: 'white', margin: '0 0 18px', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Achetez, vendez,<br />
            <span style={{ color: '#a78bfa' }}>grandissez ensemble</span>
          </h1>
          <p style={{ color: '#c4b5fd', fontSize: 17, lineHeight: 1.6, margin: '0 0 36px' }}>
            Des milliers de produits, des vendeurs de confiance et une expérience d'achat sécurisée sur une seule plateforme.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/products" style={{ padding: '13px 30px', borderRadius: 12, fontWeight: 700, fontSize: 15, background: 'white', color: '#4f46e5', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.25)' }}>
              Explorer le catalogue →
            </Link>
            <Link to="/register" style={{ padding: '13px 30px', borderRadius: 12, fontWeight: 600, fontSize: 15, border: '1.5px solid rgba(255,255,255,.3)', color: 'white', textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </div>

          {/* Stats */}
         
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, margin: '0 0 32px', color: '#0f172a' }}>Pourquoi choisir EPF Market ?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { icon: '🔒', title: 'Sécurisé', desc: 'Paiements et données protégés par les meilleurs standards.' },
            { icon: '⚡', title: 'Rapide', desc: 'Interface fluide et commandes traitées en quelques clics.' },
            { icon: '🤝', title: 'De confiance', desc: 'Vendeurs vérifiés et avis authentiques des acheteurs.' },
            { icon: '💬', title: 'Messagerie', desc: 'Communiquez directement avec vendeurs et acheteurs.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: '24px 20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Catégories populaires</h2>
            <Link to="/products" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {categories.slice(0, 8).map((cat, i) => (
              <Link key={cat.id} to={`/products?category_id=${cat.id}`} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                borderRadius: 12, background: 'white', border: '1.5px solid var(--border)',
                textDecoration: 'none', color: '#334155', fontSize: 13, fontWeight: 600,
                boxShadow: 'var(--shadow-sm)', transition: 'all .15s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#eef2ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'white'; }}>
                <span>{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</span>{cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top produits */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Produits populaires</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Connectez-vous pour accéder au catalogue complet</p>
          </div>
          <Link to="/login" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Se connecter →</Link>
        </div>
        {loading
          ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner size="lg" /></div>
          : topProducts.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}><div style={{ fontSize: 40, marginBottom: 8 }}>📦</div><p style={{ margin: 0 }}>Aucun produit disponible.</p></div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {topProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
        }
      </section>

      {/* CTA double */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', borderRadius: 20, padding: '36px 32px', border: '1.5px solid #c7d2fe' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🛍️</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#3730a3' }}>Je veux acheter</h3>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#4338ca', lineHeight: 1.5 }}>Accédez à des milliers de produits de qualité au meilleur prix.</p>
          <Link to="/register" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 10, background: '#6366f1', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            S'inscrire comme acheteur
          </Link>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 20, padding: '36px 32px', border: '1.5px solid #bbf7d0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#14532d' }}>Je veux vendre</h3>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#166534', lineHeight: 1.5 }}>Rejoignez nos vendeurs et commencez à vendre vos produits dès aujourd'hui.</p>
          <Link to="/register" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 10, background: '#16a34a', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Devenir vendeur →
          </Link>
        </div>
      </section>
    </div>
  );
}

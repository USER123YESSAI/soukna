import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getCategoryIcon } from '../utils/categoryIcons';

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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>
        {/* Bienvenue personnalisée */}
        <section style={{
          borderRadius: 28, padding: '48px 56px', marginBottom: 48,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: 'white', position: 'relative', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(139,92,246,.22)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: 60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(79,70,229,.22)', filter: 'blur(50px)' }} />

          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,.14)', color: '#c4b5fd', marginBottom: 20, border: '1px solid rgba(255,255,255,.18)' }}>
              ✦ Espace Connecté Soukna
            </span>
            <h1 style={{ margin: '0 0 16px', fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Content de vous revoir,<br />
              <span style={{ color: '#a78bfa' }}>{user?.name?.split(' ')[0]} !</span>
            </h1>
            <p style={{ margin: '0 0 32px', color: '#cbd5e1', fontSize: 16, lineHeight: 1.6 }}>
              {isAdmin ? 'Pilotez l\'activité de la plateforme, gérez les vendeurs, catégories et transactions.' : isSeller ? 'Suivez l\'évolution de vos ventes, ajoutez de nouveaux produits et gérez vos commandes.' : 'Découvrez nos dernières offres exclusives et suivez en temps réel vos commandes.'}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to={dashLink} className="btn-primary" style={{
                padding: '12px 28px', borderRadius: 99, fontWeight: 700, fontSize: 15,
                background: 'white', color: '#4f46e5', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,.2)'
              }}>
                {dashLabel} →
              </Link>
              <Link to="/products" style={{
                padding: '12px 28px', borderRadius: 99, fontWeight: 700, fontSize: 15,
                border: '1px solid rgba(255,255,255,.3)', color: 'white', textDecoration: 'none',
                background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(8px)'
              }}>
                Parcourir le catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* Catégories */}
        {categories.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Catégories</h2>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>Explorez nos sélections par univers</p>
              </div>
              <Link to="/products" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
                Voir tout ({categories.length}) →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {categories.slice(0, 8).map((cat, i) => (
                <Link key={cat.id} to={`/products?category_id=${cat.id}`} className="card-hover" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '20px 16px', borderRadius: 20, background: 'white',
                  border: '1px solid var(--border)', textDecoration: 'none', color: '#0f172a',
                  fontSize: 14, fontWeight: 700, textAlign: 'center', boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, border: '1px solid var(--border)'
                  }}>
                    {getCategoryIcon(cat)}
                  </div>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top produits */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Meilleures ventes</h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>Les produits les plus populaires du moment</p>
            </div>
            <Link to="/products" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
              Voir tout le catalogue →
            </Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner size="lg" /></div>
            : topProducts.length === 0
              ? <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 24, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Aucun produit pour le moment.</p>
                </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                  {topProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
          }
        </section>
      </div>
    );
  }

  // ── Page publique (non connecté - 100% Dynamique & Design Figma Make) ──
  const discounted = topProducts.filter(
    p => p.is_on_sale || p.discount_percentage > 0 || (p.effective_price && p.effective_price < p.price)
  );
  const flashList = discounted.length > 0 ? discounted.slice(0, 4) : topProducts.slice(0, 4);
  const popularList = topProducts.slice(0, 8);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── HERO SECTION (Figma Screenshot 1) ── */}
      <section
        style={{
          background: '#ffffff',
          padding: '80px 24px 70px',
          textAlign: 'center',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 700,
              background: '#f8fafc',
              color: '#4f46e5',
              marginBottom: 24,
              border: '1px solid #e2e8f0'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Soukna — La Marketplace de Référence
          </span>

          <h1
            className="hero-h1"
            style={{
              fontSize: 52,
              fontWeight: 800,
              margin: '0 0 20px',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              color: '#1e1b4b'
            }}
          >
            Achetez et{' '}
            <span style={{ color: '#6d28d9', background: 'linear-gradient(135deg, #6d28d9, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vendez en Toute
            </span>
            <br />
            <span style={{ color: '#6d28d9', background: 'linear-gradient(135deg, #6d28d9, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Confiance
            </span>
          </h1>

          <p
            className="hero-subtitle"
            style={{
              color: '#64748b',
              fontSize: 18,
              lineHeight: 1.6,
              margin: '0 auto 36px',
              fontWeight: 400,
              maxWidth: 680
            }}
          >
            Découvrez des milliers de produits de qualité ou vendez les vôtres sur la
            première marketplace de confiance
          </p>

          {/* Search Bar Carte Hero (Figma Screenshot 1) */}
          <form
            className="hero-search-box"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('heroSearch');
              if (input && input.value.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(input.value.trim())}`;
              } else {
                window.location.href = '/products';
              }
            }}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 35px rgba(15, 23, 42, 0.07)',
              padding: 8,
              maxWidth: 680,
              margin: '0 auto 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.2"
              style={{ marginLeft: 14, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="heroSearch"
              type="text"
              placeholder="Rechercher des produits, marques, catégories..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 15.5,
                color: '#0f172a',
                background: 'transparent',
                padding: '10px 4px'
              }}
            />
            <button
              type="submit"
              className="figma-btn-dark"
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                fontSize: 15,
                flexShrink: 0
              }}
            >
              Rechercher
            </button>
          </form>

          {/* Boutons CTA Hero (Figma Screenshot 1) */}
          <div className="hero-cta-group" style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              to="/products"
              className="figma-btn-dark"
              style={{
                padding: '13px 26px',
                borderRadius: 10,
                fontSize: 15
              }}
            >
              Explorer les Produits
            </Link>
            <Link
              to="/register"
              className="figma-btn-white"
              style={{
                padding: '13px 26px',
                borderRadius: 10,
                fontSize: 15
              }}
            >
              Devenir Vendeur
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* ── SECTION 1 : VENTES FLASH / PROMOS (Figma Screenshot 3) ── */}
        <section style={{ marginTop: 64, marginBottom: 72 }}>
          <div className="responsive-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <span style={{ display: 'inline-block', background: '#fef2f2', color: '#ef4444', fontWeight: 800, fontSize: 11, padding: '3px 10px', borderRadius: 99, marginBottom: 8 }}>
                🔥 OFFRES DU JOUR
              </span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                Ventes Flash &amp; Promotions
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14.5, color: '#64748b' }}>
                Des réductions exceptionnelles à durée limitée
              </p>
            </div>
            <Link to="/products?discount=true" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
              Voir toutes les promos →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner size="lg" />
            </div>
          ) : flashList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Aucune offre flash en cours pour le moment.</p>
            </div>
          ) : (
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {flashList.map((p) => (
                <ProductCard key={p.id} product={p} isFlashSale={true} />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2 : PRODUITS POPULAIRES & NOUVEAUTÉS (Figma Screenshots 2 & 4) ── */}
        <section style={{ marginBottom: 72 }}>
          <div className="responsive-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <span style={{ display: 'inline-block', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 99, marginBottom: 8 }}>
                ✦ SÉLECTION SOUKNA
              </span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                Produits Populaires &amp; Bestsellers
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14.5, color: '#64748b' }}>
                Explorez les articles les plus prisés par notre communauté
              </p>
            </div>
            <Link to="/products" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
              Voir tout le catalogue →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner size="lg" />
            </div>
          ) : popularList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {popularList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 3 : CATÉGORIES / UNIVERS (DYNAMIQUE) ── */}
        {categories.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div className="responsive-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                  Catégories populaires
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
                  Trouvez ce qu&apos;il vous faut par univers
                </p>
              </div>
              <Link to="/products" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
                Voir toutes les catégories →
              </Link>
            </div>
            <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
              {categories.slice(0, 8).map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/products?category_id=${cat.id}`}
                  className="card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '22px 16px',
                    borderRadius: 16,
                    background: '#ffffff',
                    border: '1px solid #f1f5f9',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24
                    }}
                  >
                    {getCategoryIcon(cat)}
                  </div>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── BANNIÈRE CTA VENDEUR DU BAS ── */}
        <section
          className="seller-banner"
          style={{
            borderRadius: 24,
            padding: '56px 40px',
            background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 620, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.5px' }}>
              Vous souhaitez vendre vos produits sur Soukna ?
            </h2>
            <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 28px', lineHeight: 1.6 }}>
              Créez votre boutique gratuitement et commencez à vendre à des milliers de clients de confiance dès aujourd&apos;hui.
            </p>
            <Link
              to="/register"
              className="figma-btn-white"
              style={{
                padding: '14px 32px',
                borderRadius: 10,
                fontSize: 15,
                background: '#ffffff',
                color: '#0f172a'
              }}
            >
              Devenir Vendeur Maintenant
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}



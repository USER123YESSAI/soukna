import { useState, useMemo } from 'react';
import { formatPrice } from '../../services/api';

/**
 * Composant graphique interactif SVG pour visualiser les ventes et le chiffre d'affaires
 */
export default function SalesChart({ data = [], title = "Évolution des ventes" }) {
  const [period, setPeriod] = useState('7'); // '7' ou '30'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Générer ou formater les données selon la période sélectionnée
  const chartData = useMemo(() => {
    const days = parseInt(period, 10);
    const result = [];
    const now = new Date();

    // Si des données réelles sont fournies, les indexer par date YYYY-MM-DD
    const mapByDate = {};
    if (Array.isArray(data)) {
      data.forEach(item => {
        const d = item.date || (item.created_at ? item.created_at.slice(0, 10) : null);
        if (d) {
          mapByDate[d] = {
            sales: (mapByDate[d]?.sales || 0) + (Number(item.total_amount) || Number(item.subtotal) || 0),
            orders: (mapByDate[d]?.orders || 0) + 1,
          };
        }
      });
    }

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
      
      const entry = mapByDate[isoDate] || { sales: 0, orders: 0 };
      result.push({
        date: isoDate,
        label: dayLabel,
        sales: entry.sales,
        orders: entry.orders,
      });
    }
    return result;
  }, [data, period]);

  // Calculs statistiques
  const totalSales = useMemo(() => chartData.reduce((acc, d) => acc + d.sales, 0), [chartData]);
  const totalOrders = useMemo(() => chartData.reduce((acc, d) => acc + d.orders, 0), [chartData]);
  const maxSales = useMemo(() => Math.max(...chartData.map(d => d.sales), 1000), [chartData]);
  const avgSales = Math.round(totalSales / chartData.length);

  // Dimensions SVG
  const width = 700;
  const height = 240;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Calcul des coordonnées
  const points = chartData.map((d, index) => {
    const x = padLeft + (index / (chartData.length - 1 || 1)) * chartWidth;
    const y = padTop + chartHeight - (d.sales / maxSales) * chartHeight;
    return { ...d, x, y };
  });

  // Path SVG de la courbe
  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x},${p.y}`;
    // Courbe de Bézier cubique pour un lissage moderne
    const prev = points[idx - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`;
  }, '');

  // Path de remplissage dégradé sous la courbe
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${padTop + chartHeight} L ${points[0].x},${padTop + chartHeight} Z`
    : '';

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1.5px solid var(--border)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* En-tête avec titre et sélecteur 7j / 30j */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{title}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Suivi des revenus et du volume de commandes
          </p>
        </div>

        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          <button
            type="button"
            onClick={() => setPeriod('7')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: period === '7' ? 'white' : 'transparent',
              color: period === '7' ? '#4f46e5' : '#64748b',
              boxShadow: period === '7' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            7 jours
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: period === '30' ? 'white' : 'transparent',
              color: period === '30' ? '#4f46e5' : '#64748b',
              boxShadow: period === '30' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            30 jours
          </button>
        </div>
      </div>

      {/* Résumé métriques */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Chiffre d'affaires</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{formatPrice(totalSales)}</div>
        </div>
        <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Commandes</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#4f46e5', marginTop: 2 }}>{totalOrders}</div>
        </div>
        <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Moyenne / jour</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981', marginTop: 2 }}>{formatPrice(avgSales)}</div>
        </div>
      </div>

      {/* Graphique SVG */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: 480, overflow: 'visible' }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Lignes de repère horizontales */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padTop + chartHeight * (1 - pct);
            const val = Math.round(maxSales * pct);
            return (
              <g key={idx}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray={pct > 0 && pct < 1 ? "4 4" : "none"} />
                <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Remplissage dégradé */}
          {areaD && <path d={areaD} fill="url(#salesGrad)" />}

          {/* Ligne principale */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points interactifs */}
          {points.map((p, idx) => {
            const isHovered = hoveredPoint?.date === p.date;
            // N'afficher les labels X que pour certains points si 30 jours pour éviter surcharge
            const showLabel = period === '7' || idx % 5 === 0 || idx === points.length - 1;

            return (
              <g key={p.date}>
                {/* Ligne verticale au survol */}
                {isHovered && (
                  <line x1={p.x} y1={padTop} x2={p.x} y2={padTop + chartHeight} stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
                )}

                {/* Point */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : (period === '7' ? 4.5 : 3)}
                  fill={isHovered ? "#4f46e5" : "white"}
                  stroke="#6366f1"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Étiquette d'axe X */}
                {showLabel && (
                  <text
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isHovered ? "#4f46e5" : "#94a3b8"}
                    fontWeight={isHovered ? 700 : 500}
                  >
                    {p.label.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Infobulle de survol (Tooltip) */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: Math.max(hoveredPoint.y - 65, 0),
              left: Math.min(Math.max(hoveredPoint.x - 70, 0), width - 140),
              background: '#0f172a',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{hoveredPoint.label}</div>
            <div style={{ color: '#a5b4fc' }}>Ventes : {formatPrice(hoveredPoint.sales)}</div>
            <div style={{ color: '#cbd5e1' }}>{hoveredPoint.orders} commande(s)</div>
          </div>
        )}
      </div>
    </div>
  );
}

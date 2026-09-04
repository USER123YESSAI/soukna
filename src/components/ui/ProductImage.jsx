import { useMemo, useState, useEffect } from 'react';
import { resolveMediaUrl } from '../../services/api';

const PLACEHOLDER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#e0e7ff"/>` +
      `<stop offset="1" stop-color="#f1f5f9"/>` +
      `</linearGradient></defs>` +
      `<rect width="160" height="160" rx="24" fill="url(#g)"/>` +
      `<path d="M32 102 L60 78 L80 96 L104 70 L128 92" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="56" cy="56" r="12" fill="#94a3b8"/>` +
      `</svg>`
  );

// Cache mémoire pour mémoriser les images déjà chargées pendant la session
const loadedImageCache = new Set();

export default function ProductImage({
  src,
  alt = '',
  className = '',
  style,
  width,
  height,
  priority = false,
  fallbackSrc = PLACEHOLDER_SVG,
  ...props
}) {
  const resolved = resolveMediaUrl(src);
  const [errored, setErrored] = useState(false);

  const finalSrc = useMemo(() => {
    if (!resolved || errored) return fallbackSrc;
    return resolved;
  }, [resolved, errored, fallbackSrc]);

  const isAlreadyCached = Boolean(finalSrc && loadedImageCache.has(finalSrc));
  const isSvgFallback = Boolean(finalSrc && finalSrc.startsWith('data:image/svg'));
  const [loaded, setLoaded] = useState(isAlreadyCached || isSvgFallback);

  useEffect(() => {
    if (finalSrc && loadedImageCache.has(finalSrc)) {
      setLoaded(true);
    } else if (finalSrc && !finalSrc.startsWith('data:image/svg')) {
      setLoaded(false);
    }
  }, [finalSrc]);

  const handleLoad = () => {
    if (finalSrc) loadedImageCache.add(finalSrc);
    setLoaded(true);
  };

  const handleError = () => {
    setErrored(true);
    setLoaded(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: width ?? '100%',
        height: height ?? '100%',
        overflow: 'hidden',
        borderRadius: style?.borderRadius ?? 12,
        backgroundColor: '#f1f5f9',
        ...style,
      }}
      className={`product-image-container ${className}`}
    >
      {/* Skeleton Shimmer affiché pendant le chargement initial */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmerPulse 1.5s infinite linear',
            zIndex: 1,
          }}
        />
      )}

      {/* Balise image optimisée avec transition douce */}
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error fetchpriority is standard HTML
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: style?.objectFit ?? 'cover',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        {...props}
      />

      <style>{`
        @keyframes shimmerPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}


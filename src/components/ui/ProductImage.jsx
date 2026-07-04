import { useMemo, useState } from 'react';
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

export default function ProductImage({
  src,
  alt = '',
  className,
  style,
  width = 80,
  height = 80,
  fallbackSrc = PLACEHOLDER_SVG,
  ...props
}) {
  const resolved = resolveMediaUrl(src);
  const [errored, setErrored] = useState(false);

  const finalSrc = useMemo(() => {
    if (!resolved || errored) return fallbackSrc;
    return resolved;
  }, [resolved, errored, fallbackSrc]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      style={{
        width,
        height,
        borderRadius: 12,
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      {...props}
    />
  );
}


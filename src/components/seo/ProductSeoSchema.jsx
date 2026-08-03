import { useEffect } from 'react';

/**
 * Composant ProductSeoSchema
 * Gère les balises méta SEO dynamique et injecte le schéma JSON-LD Google Merchant / Rich Snippets
 */
export default function ProductSeoSchema({ product }) {
  useEffect(() => {
    if (!product) return;

    // Mise à jour du titre du document
    const previousTitle = document.title;
    document.title = `${product.name} — Soukna`;

    // Mise à jour ou création de la balise méta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = product.description
      ? product.description.substring(0, 160)
      : `Achetez ${product.name} au meilleur prix sur la marketplace Soukna.`;

    return () => {
      document.title = previousTitle;
    };
  }, [product]);

  if (!product) return null;

  const price = product.effective_price ?? product.price ?? '0.00';
  const inStock = product.stock > 0 || product.in_stock !== false;
  const imageUrl = product.image_url || product.image || 'https://soukna.fr/default-product.png';

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.description || product.name,
    sku: `SOUK-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Soukna',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'EUR',
      price: String(price),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || '4.8',
      reviewCount: product.review_count || product.reviews_count || '24',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
  );
}

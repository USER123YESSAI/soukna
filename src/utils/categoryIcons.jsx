import React from 'react';
import {
  Laptop,
  Shirt,
  Home,
  Gamepad2,
  Headphones,
  Footprints,
  BookOpen,
  Sparkles,
  Car,
  Utensils,
  Watch,
  Wrench,
  Baby,
  ShoppingBag,
  Package,
  Tag,
  Gift
} from 'lucide-react';

/**
 * Retourne le composant SVG Lucide adéquat en fonction de la catégorie.
 */
export function getCategoryIcon(category, props = { size: 20, className: 'text-indigo-600' }) {
  if (!category) return <ShoppingBag {...props} />;

  const name = (typeof category === 'string' ? category : category.name || '').toLowerCase().trim();

  // 1. Détection intelligente par mot-clé dans le nom de la catégorie
  if (
    name.includes('électr') ||
    name.includes('electr') ||
    name.includes('high-tech') ||
    name.includes('informatique') ||
    name.includes('ordinat') ||
    name.includes('pc') ||
    name.includes('téléphon') ||
    name.includes('telephon') ||
    name.includes('smartphone') ||
    name.includes('gadget')
  ) {
    return <Laptop {...props} />;
  }

  if (
    name.includes('mode') ||
    name.includes('vêtement') ||
    name.includes('vetement') ||
    name.includes('habit') ||
    name.includes('textile') ||
    name.includes('robe') ||
    name.includes('prêt-à-porter')
  ) {
    return <Shirt {...props} />;
  }

  if (
    name.includes('maison') ||
    name.includes('décor') ||
    name.includes('decor') ||
    name.includes('mobilier') ||
    name.includes('meuble') ||
    name.includes('intérieur') ||
    name.includes('salon')
  ) {
    return <Home {...props} />;
  }

  if (
    name.includes('loisir') ||
    name.includes('divertissement') ||
    name.includes('jeu') ||
    name.includes('jouet') ||
    name.includes('sport') ||
    name.includes('hobby')
  ) {
    return <Gamepad2 {...props} />;
  }

  if (
    name.includes('audio') ||
    name.includes('casque') ||
    name.includes('son') ||
    name.includes('musique') ||
    name.includes('écouteur')
  ) {
    return <Headphones {...props} />;
  }

  if (
    name.includes('chaussur') ||
    name.includes('basket') ||
    name.includes('sneaker') ||
    name.includes('soulier')
  ) {
    return <Footprints {...props} />;
  }

  if (
    name.includes('livre') ||
    name.includes('lecture') ||
    name.includes('cultur') ||
    name.includes('papeterie')
  ) {
    return <BookOpen {...props} />;
  }

  if (
    name.includes('beauté') ||
    name.includes('beaute') ||
    name.includes('santé') ||
    name.includes('sante') ||
    name.includes('parfum') ||
    name.includes('cosméti')
  ) {
    return <Sparkles {...props} />;
  }

  if (
    name.includes('auto') ||
    name.includes('moto') ||
    name.includes('véhicul') ||
    name.includes('vehicul') ||
    name.includes('voiture')
  ) {
    return <Car {...props} />;
  }

  if (
    name.includes('aliment') ||
    name.includes('épicer') ||
    name.includes('epicer') ||
    name.includes('cuisine') ||
    name.includes('nourriture') ||
    name.includes('restaurant')
  ) {
    return <Utensils {...props} />;
  }

  if (
    name.includes('bijou') ||
    name.includes('montre') ||
    name.includes('accessoir')
  ) {
    return <Watch {...props} />;
  }

  if (
    name.includes('jardin') ||
    name.includes('bricolage') ||
    name.includes('outil')
  ) {
    return <Wrench {...props} />;
  }

  if (
    name.includes('enfant') ||
    name.includes('bébé') ||
    name.includes('bebe')
  ) {
    return <Baby {...props} />;
  }

  // 2. Fallback déterministe avec composants SVG Lucide
  const fallbackIcons = [ShoppingBag, Package, Sparkles, Tag, Gift];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const IconComponent = fallbackIcons[Math.abs(hash) % fallbackIcons.length];
  return <IconComponent {...props} />;
}

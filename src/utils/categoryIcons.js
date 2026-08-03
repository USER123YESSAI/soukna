/**
 * Retourne l'icône émoji adéquate en fonction du nom de la catégorie ou de l'icône en base.
 */
export function getCategoryIcon(category) {
  if (!category) return '🛍️';

  const name = (typeof category === 'string' ? category : category.name || '').toLowerCase().trim();

  // 1. Détection intelligente par mot-clé dans le nom de la catégorie
  if (name.includes('électr') || name.includes('electr') || name.includes('high-tech') || name.includes('informatique') || name.includes('ordinat') || name.includes('pc') || name.includes('téléphon') || name.includes('telephon') || name.includes('smartphone') || name.includes('gadget')) {
    return '💻';
  }
  if (name.includes('mode') || name.includes('vêtement') || name.includes('vetement') || name.includes('habit') || name.includes('textile') || name.includes('robe') || name.includes('prêt-à-porter')) {
    return '👗';
  }
  if (name.includes('maison') || name.includes('décor') || name.includes('decor') || name.includes('mobilier') || name.includes('meuble') || name.includes('intérieur') || name.includes('salon')) {
    return '🏠';
  }
  if (name.includes('loisir') || name.includes('divertissement') || name.includes('jeu') || name.includes('jouet') || name.includes('sport') || name.includes('hobby')) {
    return '🎮';
  }
  if (name.includes('audio') || name.includes('casque') || name.includes('son') || name.includes('musique') || name.includes('écouteur')) {
    return '🎧';
  }
  if (name.includes('chaussur') || name.includes('basket') || name.includes('sneaker') || name.includes('soulier')) {
    return '👟';
  }
  if (name.includes('livre') || name.includes('lecture') || name.includes('cultur') || name.includes('papeterie')) {
    return '📚';
  }
  if (name.includes('beauté') || name.includes('beaute') || name.includes('santé') || name.includes('sante') || name.includes('parfum') || name.includes('cosméti')) {
    return '💄';
  }
  if (name.includes('auto') || name.includes('moto') || name.includes('véhicul') || name.includes('vehicul') || name.includes('voiture')) {
    return '🚗';
  }
  if (name.includes('aliment') || name.includes('épicer') || name.includes('epicer') || name.includes('cuisine') || name.includes('nourriture') || name.includes('restaurant')) {
    return '🍳';
  }
  if (name.includes('bijou') || name.includes('montre') || name.includes('accessoir')) {
    return '⌚';
  }
  if (name.includes('jardin') || name.includes('bricolage') || name.includes('outil')) {
    return '🛠️';
  }
  if (name.includes('enfant') || name.includes('bébé') || name.includes('bebe')) {
    return '🧸';
  }

  // 2. Si une icône est spécifiée en base et est un émoji valide, on l'utilise
  if (typeof category === 'object' && category.icon && category.icon.trim().length <= 4) {
    return category.icon.trim();
  }

  // 3. Fallback déterministe basé sur le hachage du nom pour une cohérence visuelle
  const fallbackIcons = ['🛍️', '📦', '✨', '🏷️', '💎', '🎁'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackIcons[Math.abs(hash) % fallbackIcons.length];
}

export type BadgeCategory = 'daily' | 'weekly' | 'phase' | 'ultimate';

export interface BadgeDefinition {
  slug: string;
  name: string;
  category: BadgeCategory;
  description: string;      // Contexte narratif
  unlockCondition: string;  // Ce que l'utilisateur doit faire
  color: string;            // Couleur principale (pour placeholder CSS)
  icon: string;             // Emoji placeholder (remplacé par image plus tard)
  order: number;            // Ordre d'affichage dans sa catégorie
}

export const BADGES: BadgeDefinition[] = [
  // ─────────────────────────────────────────────
  // BADGES JOURNALIERS
  // ─────────────────────────────────────────────
  {
    slug: 'premier-sang',
    name: 'Premier Sang',
    category: 'daily',
    description: "Première séance complétée. Le plus dur est fait.",
    unlockCondition: 'Termine ta première séance',
    color: '#8B2E1F',
    icon: '🩸',
    order: 1,
  },
  {
    slug: 'perseverance',
    name: 'Persévérance',
    category: 'daily',
    description: "Dix séances. Tu fais plus que commencer, tu continues.",
    unlockCondition: 'Termine 10 séances',
    color: '#6B8E8F',
    icon: '💪',
    order: 2,
  },
  {
    slug: 'legende',
    name: 'Légende',
    category: 'daily',
    description: "Cinquante séances. Tu n'es plus un débutant depuis longtemps.",
    unlockCondition: 'Termine 50 séances',
    color: '#D4AF37',
    icon: '👑',
    order: 3,
  },

  // ─────────────────────────────────────────────
  // BADGES HEBDOMADAIRES (métaux)
  // ─────────────────────────────────────────────
  {
    slug: 'etain',
    name: 'Étain',
    category: 'weekly',
    description: "Semaine 1 bouclée. Premier pas dans le métal.",
    unlockCondition: 'Complète la semaine 1',
    color: '#B8B8B0',
    icon: '🪙',
    order: 1,
  },
  {
    slug: 'cuivre',
    name: 'Cuivre',
    category: 'weekly',
    description: "Semaine 2 bouclée. Conductivité acquise.",
    unlockCondition: 'Complète la semaine 2',
    color: '#B87333',
    icon: '🔶',
    order: 2,
  },
  {
    slug: 'bronze',
    name: 'Bronze',
    category: 'weekly',
    description: "Semaine 3 bouclée. L'alliage est né.",
    unlockCondition: 'Complète la semaine 3',
    color: '#A06B2B',
    icon: '🥉',
    order: 3,
  },
  {
    slug: 'fer',
    name: 'Fer',
    category: 'weekly',
    description: "Semaine 4 bouclée. Base solide.",
    unlockCondition: 'Complète la semaine 4',
    color: '#4A4A4A',
    icon: '⚙️',
    order: 4,
  },
  {
    slug: 'acier',
    name: 'Acier',
    category: 'weekly',
    description: "Semaine 5 bouclée. Trempé par l'épreuve.",
    unlockCondition: 'Complète la semaine 5',
    color: '#5B7080',
    icon: '🗡️',
    order: 5,
  },
  {
    slug: 'argent',
    name: 'Argent',
    category: 'weekly',
    description: "Semaine 6 bouclée. Éclat de noblesse.",
    unlockCondition: 'Complète la semaine 6',
    color: '#C0C0C0',
    icon: '🥈',
    order: 6,
  },
  {
    slug: 'or',
    name: 'Or',
    category: 'weekly',
    description: "Semaine 7 bouclée. Valeur établie.",
    unlockCondition: 'Complète la semaine 7',
    color: '#D4AF37',
    icon: '🥇',
    order: 7,
  },
  {
    slug: 'platine',
    name: 'Platine',
    category: 'weekly',
    description: "Semaine 8 bouclée. Au sommet du métal.",
    unlockCondition: 'Complète la semaine 8',
    color: '#E5E4E2',
    icon: '💎',
    order: 8,
  },

  // ─────────────────────────────────────────────
  // CERTIFICATIONS DE PHASE
  // ─────────────────────────────────────────────
  {
    slug: 'initiation',
    name: "Certificat d'Initiation",
    category: 'phase',
    description: "Phase 1 terminée. La fondation est posée.",
    unlockCondition: 'Complète les semaines 1 à 4',
    color: '#ff5722',
    icon: '⚔️',
    order: 1,
  },
  {
    slug: 'aguerrissement',
    name: "Certificat d'Aguerrissement",
    category: 'phase',
    description: "Phase 2 terminée. Tu as tenu l'intensité.",
    unlockCondition: 'Complète les semaines 5 à 8',
    color: '#ffb020',
    icon: '🏔️',
    order: 2,
  },

  // ─────────────────────────────────────────────
  // RÉCOMPENSE ULTIME
  // ─────────────────────────────────────────────
  {
    slug: 'iron-45',
    name: 'IRON 45',
    category: 'ultimate',
    description: "Programme complet. Tu es devenu Iron.",
    unlockCondition: 'Complète le programme de 8 semaines',
    color: '#d4ff00',
    icon: '⭐',
    order: 1,
  },
];

// Helper : récupérer un badge par son slug
export function getBadge(slug: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.slug === slug);
}

// Helper : grouper les badges par catégorie pour affichage
export function badgesByCategory(): Record<BadgeCategory, BadgeDefinition[]> {
  return {
    daily:    BADGES.filter((b) => b.category === 'daily').sort((a, b) => a.order - b.order),
    weekly:   BADGES.filter((b) => b.category === 'weekly').sort((a, b) => a.order - b.order),
    phase:    BADGES.filter((b) => b.category === 'phase').sort((a, b) => a.order - b.order),
    ultimate: BADGES.filter((b) => b.category === 'ultimate').sort((a, b) => a.order - b.order),
  };
}
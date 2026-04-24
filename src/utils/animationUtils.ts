/**
 * Utilitaire pour gérer les animations
 * Permet d'appliquer des animations dynamiquement et avec des configurations
 */

export type AnimationType = 
  | 'fadeIn'
  | 'fadeUp'
  | 'fadeLeft'
  | 'fadeRight'
  | 'fadeScale'
  | 'fadeBounce'
  | 'flipIn'
  | 'zoomIn'
  | 'zoomOut'
  | 'shake'
  | 'wiggle'
  | 'pulse';

export interface AnimationConfig {
  type: AnimationType;
  delay?: number; // en ms
  duration?: number; // en ms (par défaut 800)
  onAnimationEnd?: () => void;
}

/**
 * Retourne le nom de la classe CSS correspondant à une animation
 */
export const getAnimationClass = (type: AnimationType, delay?: number): string => {
  const baseClass = `animate-${type.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  
  if (delay) {
    if (delay === 100) return `${baseClass}-delay-100`;
    if (delay === 200) return `${baseClass}-delay-200`;
    if (delay === 300) return `${baseClass}-delay-300`;
  }
  
  return baseClass;
};

/**
 * Crée un style inline pour une animation dynamique
 */
export const getAnimationStyle = (config: AnimationConfig): React.CSSProperties => {
  const animationName = config.type.replace(/([A-Z])/g, '-$1').toLowerCase();
  const duration = config.duration || 800;
  const delay = config.delay || 0;

  return {
    animation: `${animationName} ${duration}ms ease-out ${delay}ms forwards`,
    opacity: config.type.includes('fade') ? 0 : 1,
  };
};

/**
 * Liste toutes les animations disponibles
 */
export const AVAILABLE_ANIMATIONS: AnimationType[] = [
  'fadeIn',
  'fadeUp',
  'fadeLeft',
  'fadeRight',
  'fadeScale',
  'fadeBounce',
  'flipIn',
  'zoomIn',
  'zoomOut',
  'shake',
  'wiggle',
  'pulse',
];

/**
 * Configuration par défaut pour différents cas d'usage
 */
export const ANIMATION_PRESETS = {
  // Animations au chargement
  pageLoad: {
    title: { type: 'fadeUp' as AnimationType, delay: 0 },
    subtitle: { type: 'fadeUp' as AnimationType, delay: 100 },
    content: { type: 'fadeUp' as AnimationType, delay: 200 },
  },
  
  // Animations pour les listes
  listItems: {
    item1: { type: 'fadeUp' as AnimationType, delay: 0 },
    item2: { type: 'fadeUp' as AnimationType, delay: 100 },
    item3: { type: 'fadeUp' as AnimationType, delay: 200 },
    item4: { type: 'fadeUp' as AnimationType, delay: 300 },
  },

  // Animations pour les cartes
  cards: {
    type: 'fadeScale' as AnimationType,
    delay: 100,
  },

  // Animations pour les boutons
  button: {
    type: 'fadeScale' as AnimationType,
    delay: 0,
  },

  // Animations pour les formulaires
  formField: {
    type: 'slideInFromLeft' as AnimationType,
    delay: 100,
  },
};

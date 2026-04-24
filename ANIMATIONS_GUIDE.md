# Guide Complet des Animations Fade

Ce guide explique comment utiliser le système d'animations fade complet dans votre application React.

## 📚 Vue d'ensemble

Le système d'animations comprend:
- **Classes CSS** pour animations automatiques au chargement
- **Hook personnalisé** pour l'IntersectionObserver au scroll
- **Composants wrapper** pour simplifier l'utilisation
- **Utilitaires** pour les animations dynamiques

## 🎨 Types d'animations disponibles

### Animations de base
- `fadeIn` - Apparition progressive
- `fadeUp` - Apparition avec remontée
- `fadeLeft` - Apparition de la gauche
- `fadeRight` - Apparition de la droite
- `fadeScale` - Apparition avec agrandissement
- `fadeBounce` - Apparition avec rebond

### Animations avancées
- `flipIn` - Retournement 3D
- `zoomIn` / `zoomOut` - Zoom
- `shake` - Secousse
- `wiggle` - Ondulation
- `pulse` - Pulsation

## 1️⃣ Animations au chargement (Classes CSS)

### Syntaxe simple
Appliquez directement une classe sur votre élément:

```tsx
<div className="animate-fade-in-up">
  Contenu qui s'affiche en remontant
</div>
```

### Classes disponibles
```tsx
className="animate-fade-in"         // Fade simple
className="animate-fade-in-up"      // Fade + remontée
className="animate-fade-in-left"    // Fade + vient de la gauche
className="animate-fade-in-right"   // Fade + vient de la droite
className="animate-fade-in-scale"   // Fade + agrandissement
className="animate-fade-in-bounce"  // Fade + rebond
className="animate-flip-in"         // Retournement 3D
className="animate-zoom-in"         // Zoom entrant
className="animate-shake"           // Secousse
className="animate-pulse"           // Pulsation infinie
```

## 2️⃣ Animations en cascade (Délais)

Parfait pour plusieurs éléments:

```tsx
<div className="animate-fade-in-up">Titre</div>
<p className="animate-fade-in-up-delay-100">Sous-titre</p>
<p className="animate-fade-in-up-delay-200">Description</p>
<button className="animate-fade-in-up-delay-300">Bouton</button>
```

### Délais disponibles
- `-delay-100` (0.1s)
- `-delay-200` (0.2s)
- `-delay-300` (0.3s)

Pour autres animations: `fadeInScale`, `fadeInLeft`, `fadeInRight`

## 3️⃣ Animations au scroll (Hook)

### Hook simple - Un élément
```tsx
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

function MyComponent() {
  const elementRef = useFadeInOnScroll({ threshold: 0.1 });

  return (
    <section ref={elementRef} className="scroll-animate-fade-up">
      S'anime quand le scroll atteint cet élément
    </section>
  );
}
```

### Classes pour le scroll
```tsx
className="scroll-animate-fade"       // Fade simple
className="scroll-animate-fade-up"    // Fade + remontée
className="scroll-animate-fade-left"  // Fade de la gauche
className="scroll-animate-fade-right" // Fade de la droite
className="scroll-animate-fade-scale" // Fade + agrandissement
```

### Hook pour cascade - Plusieurs éléments
```tsx
import { useFadeInOnScrollStaggered } from '../hooks/useFadeInOnScroll';

function MyComponent() {
  const containerRef = useFadeInOnScrollStaggered();

  return (
    <div ref={containerRef}>
      <div data-stagger className="scroll-animate-fade-up">Item 1</div>
      <div data-stagger className="scroll-animate-fade-up">Item 2</div>
      <div data-stagger className="scroll-animate-fade-up">Item 3</div>
    </div>
  );
}
```

## 4️⃣ Composants wrapper (Plus facile!)

### AnimatedElement
Wrapper simple pour animer un élément au scroll:

```tsx
import { AnimatedElement } from '../components/AnimatedElement';

function Page() {
  return (
    <div>
      <AnimatedElement animationType="fadeUp">
        <h2>Titre</h2>
        <p>Contenu qui s'anime au scroll</p>
      </AnimatedElement>

      <AnimatedElement animationType="fadeScale">
        <div className="card">Carte qui s'agrandit</div>
      </AnimatedElement>
    </div>
  );
}
```

Types disponibles: `fade`, `fadeUp`, `fadeLeft`, `fadeRight`, `fadeScale`

### AnimatedList
Pour lister des éléments avec animations en cascade:

```tsx
import { AnimatedList } from '../components/AnimatedElement';

function Page() {
  return (
    <AnimatedList animationType="fadeUp" staggerDelay={100}>
      <div className="item">Article 1</div>
      <div className="item">Article 2</div>
      <div className="item">Article 3</div>
    </AnimatedList>
  );
}
```

## 5️⃣ Utilitaires dynamiques

Pour les animations générées dynamiquement:

```tsx
import { getAnimationClass, ANIMATION_PRESETS } from '../utils/animationUtils';

// Obtenir le nom d'une classe
const className = getAnimationClass('fadeUp', 100);
// Résultat: "animate-fade-up-delay-100"

// Utiliser les présets
<h1 className={getAnimationClass(ANIMATION_PRESETS.pageLoad.title.type)}>
  Titre
</h1>
```

## 📋 Exemples complets

### Page d'accueil avec animations complexes
```tsx
import { AnimatedElement, AnimatedList } from '../components/AnimatedElement';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

export function HomePage() {
  const testimonialsRef = useFadeInOnScroll();

  return (
    <>
      {/* Titre avec délai */}
      <h1 className="animate-fade-in-up">Bienvenue</h1>
      <p className="animate-fade-in-up-delay-100">Sous-titre</p>

      {/* Section avec composant wrapper */}
      <AnimatedElement animationType="fadeUp">
        <section>
          <h2>À propos</h2>
          <p>Contenu de la section</p>
        </section>
      </AnimatedElement>

      {/* Liste de produits en cascade */}
      <AnimatedList animationType="fadeScale" staggerDelay={100}>
        <ProductCard product={products[0]} />
        <ProductCard product={products[1]} />
        <ProductCard product={products[2]} />
      </AnimatedList>

      {/* Section personnalisée au scroll */}
      <section ref={testimonialsRef} className="scroll-animate-fade-up">
        <h2>Témoignages</h2>
        <div className="testimonials">...</div>
      </section>
    </>
  );
}
```

### Formulaire avec animations
```tsx
function LoginForm() {
  return (
    <form>
      <div className="form-input animate-fade-in">
        <label>Email</label>
        <input type="email" />
      </div>
      
      <div className="form-input animate-fade-in-delay-100">
        <label>Mot de passe</label>
        <input type="password" />
      </div>
      
      <button className="animate-fade-in-scale-delay-200">
        Connexion
      </button>
    </form>
  );
}
```

### Galerie avec animations au scroll
```tsx
import { AnimatedList } from '../components/AnimatedElement';

function Gallery({ images }) {
  return (
    <AnimatedList animationType="fadeScale" staggerDelay={150}>
      {images.map((img) => (
        <div key={img.id} className="gallery-item">
          <img src={img.url} alt={img.title} />
          <h3>{img.title}</h3>
        </div>
      ))}
    </AnimatedList>
  );
}
```

## 🎛️ Configuration du Hook

Options de `useFadeInOnScroll`:

```tsx
const elementRef = useFadeInOnScroll({
  threshold: 0.2,                    // Déclencher quand 20% visible (défaut: 0.1)
  rootMargin: '0px 0px -100px 0px'  // Déclencher 100px avant le viewport
});
```

## 🎯 Bonnes pratiques

1. **Utilisez le scroll pour le contenu long** - Meilleure performance que d'animer tout au chargement
2. **Cascade modérée** - Délais max 300ms pour éviter que les utilisateurs attendent
3. **Testez sur mobile** - Les animations impactent les performances mobiles
4. **Cohérence** - Utilisez les mêmes animations dans votre app
5. **Accessibilité** - Les animations ne doivent pas gêner la compréhension
6. **Désactiver sur demande** - Respecter `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## 📁 Fichiers du système d'animations

- `src/styles/animations.css` - Toutes les définitions CSS des animations
- `src/hooks/useFadeInOnScroll.ts` - Hooks IntersectionObserver
- `src/components/AnimatedElement.tsx` - Composants wrapper
- `src/utils/animationUtils.ts` - Utilitaires et présets
- `src/index.css` - Import central des animations

## ⚡ Performance

Les animations utilisent:
- **CSS animations** - Optimisées par le navigateur
- **IntersectionObserver** - Détecte le scroll sans calculer les positions
- **transform et opacity** - Propriétés GPU-accélérées pour performance

## 🔄 Compatibilité

Supporté dans tous les navigateurs modernes:
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 79+


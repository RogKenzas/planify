# Quick Start - Animations Fade 🚀

Démarrer en 30 secondes !

## ⚡ Utilisation rapide

### 1. Animation simple au chargement
```tsx
<h1 className="animate-fade-in-up">Bonjour</h1>
```

### 2. Plusieurs éléments en cascade
```tsx
<div className="animate-fade-in-up">Titre</div>
<p className="animate-fade-in-up-delay-100">Sous-titre</p>
<button className="animate-fade-in-up-delay-200">Bouton</button>
```

### 3. Animation au scroll
```tsx
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

function MyComponent() {
  const ref = useFadeInOnScroll();
  return <div ref={ref} className="scroll-animate-fade-up">S'anime au scroll</div>;
}
```

### 4. Composant wrapper (plus facile!)
```tsx
import { AnimatedElement } from '../components/AnimatedElement';

<AnimatedElement animationType="fadeUp">
  <Card />
</AnimatedElement>
```

### 5. Liste d'éléments
```tsx
import { AnimatedList } from '../components/AnimatedElement';

<AnimatedList animationType="fadeScale" staggerDelay={100}>
  <Item />
  <Item />
  <Item />
</AnimatedList>
```

## 📋 Classes disponibles

### Animations au chargement
- `animate-fade-in`
- `animate-fade-in-up`
- `animate-fade-in-left`
- `animate-fade-in-right`
- `animate-fade-in-scale`
- `animate-fade-in-bounce`
- `animate-flip-in`
- `animate-zoom-in`

### Avec délai
Ajoutez `-delay-100`, `-delay-200`, ou `-delay-300`:
```tsx
<div className="animate-fade-in-up-delay-100">Élément 2</div>
<div className="animate-fade-in-up-delay-200">Élément 3</div>
```

### Au scroll
Utilisez avec le hook ou le composant wrapper:
- `scroll-animate-fade`
- `scroll-animate-fade-up`
- `scroll-animate-fade-left`
- `scroll-animate-fade-right`
- `scroll-animate-fade-scale`

## 🎯 Cas courants

### Page d'accueil
```tsx
// Hero
<h1 className="animate-fade-in-up">Titre</h1>
<p className="animate-fade-in-up-delay-100">Description</p>

// Contenu au scroll
<section>
  <AnimatedElement animationType="fadeUp">
    <Card />
  </AnimatedElement>
</section>
```

### Formulaire
```tsx
<form>
  <input className="animate-fade-in-left" style={{ animationDelay: '0s' }} />
  <input className="animate-fade-in-left" style={{ animationDelay: '0.1s' }} />
  <button className="animate-fade-in-up-delay-200">Envoyer</button>
</form>
```

### Galerie
```tsx
<AnimatedList animationType="fadeScale">
  {images.map(img => <img key={img.id} src={img.url} />)}
</AnimatedList>
```

## 🎨 Types d'animations

| Classe | Effet |
|--------|-------|
| `fadeIn` | Apparition simple |
| `fadeUp` | Remonte en apparaissant ⬆️ |
| `fadeLeft` | Arrive de la gauche ➡️ |
| `fadeRight` | Arrive de la droite ⬅️ |
| `fadeScale` | S'agrandit ➕ |
| `fadeBounce` | Rebondit 🏀 |

## 📚 Voir les exemples

Voir `src/components/AnimationExamples.tsx` pour 10 composants d'exemple.

## 🔗 Guides complets

- **ANIMATIONS_GUIDE.md** - Guide détaillé avec tous les cas
- **ANIMATIONS_ARCHITECTURE.md** - Comment ça marche en coulisse

## 💡 Tips

1. **Combo parfait:** `fadeUp + delay` pour les listes
2. **Pour le scroll:** Utilisez `AnimatedElement` ou `AnimatedList`
3. **Performance:** Le scroll est mieux que le chargement pour les longs contenus
4. **Délai max:** 300ms pour que ça reste fluide
5. **Mobile:** Les animations fonctionnent mais testez la performance

## 🚫 Ce qu'il faut éviter

- ❌ Trop d'animations simultanées (max 5-10)
- ❌ Délais trop longs (max 300ms)
- ❌ Animations complexes (rotate, scale, etc.)
- ❌ Oublier d'importer `index.css`

## 🆘 Si ça ne fonctionne pas

1. **Vérifier** que `index.css` est importé dans `main.tsx`
2. **Vérifier** que la classe CSS est appliquée au DOM
3. **Vérifier** dans DevTools (F12) si les animations s'affichent
4. **Redémarrer** le serveur si rien n'y fait

## 🎓 Prochaines étapes

1. ✅ Essayer une animation simple: `<div className="animate-fade-in-up">`
2. ✅ Ajouter des délais sur plusieurs éléments
3. ✅ Utiliser le hook sur une section scrollable
4. ✅ Utiliser `AnimatedElement` ou `AnimatedList`
5. ✅ Créer vos propres animations personnalisées

Bon amusement ! 🎉

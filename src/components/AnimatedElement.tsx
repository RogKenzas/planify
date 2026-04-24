import React from 'react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface AnimatedElementProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fadeScale';
  threshold?: number;
  rootMargin?: string;
}

/**
 * Composant wrapper pour appliquer des animations fade au scroll
 * Simplifie l'utilisation du hook useFadeInOnScroll
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animationType = 'fadeUp',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) => {
  const elementRef = useFadeInOnScroll({ threshold, rootMargin });

  const animationClass = `scroll-animate-fade${
    animationType === 'fade' ? '' : `-${animationType}`
  }`;

  return (
    <div ref={elementRef} className={animationClass}>
      {children}
    </div>
  );
};

interface AnimatedListProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fadeScale';
  staggerDelay?: number; // délai en ms entre chaque élément
  threshold?: number;
  rootMargin?: string;
}

/**
 * Composant pour animer une liste d'éléments en cascade au scroll
 * Les enfants directs seront animés avec délai en cascade
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  animationType = 'fadeUp',
  staggerDelay = 100,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) => {
  const containerRef = useFadeInOnScroll({ threshold, rootMargin });

  const animationClass = `scroll-animate-fade${
    animationType === 'fade' ? '' : `-${animationType}`
  }`;

  // Cloner les enfants et ajouter l'animation
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return (
        <div
          key={index}
          className={animationClass}
          style={{
            animationDelay: `${index * (staggerDelay / 1000)}s`,
            opacity: 0
          }}
        >
          {child}
        </div>
      );
    }
    return child;
  });

  return (
    <div ref={containerRef}>
      {animatedChildren}
    </div>
  );
};

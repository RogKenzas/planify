import { useEffect, useRef } from 'react';

interface UseFadeInOnScrollOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * Hook personnalisé pour animer les éléments au scroll
 * @param options - Options pour l'IntersectionObserver
 * @returns Ref à attacher à l'élément à animer
 */
export const useFadeInOnScroll = (options: UseFadeInOnScrollOptions = {}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Ajouter la classe 'visible' pour déclencher l'animation
                    entry.target.classList.add('visible');
                    // Optionnel : arrêter d'observer après l'animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: options.threshold ?? 0.1,
            rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
        });

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options.threshold, options.rootMargin]);

    return elementRef;
};

/**
 * Hook pour animer plusieurs éléments avec délais en cascade
 * @param options - Options pour l'IntersectionObserver
 * @returns Fonction à appeler avec l'index de l'élément
 */
export const useFadeInOnScrollStaggered = (options: UseFadeInOnScrollOptions = {}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('[data-stagger]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: options.threshold ?? 0.1,
            rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
        });

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, [options.threshold, options.rootMargin]);

    return containerRef;
};

/**
 * Exemples de composants avec animations
 * Utilisez ces composants comme référence pour implémenter les animations dans votre app
 */

import React from 'react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';
import { AnimatedElement, AnimatedList } from './AnimatedElement';

/**
 * Exemple 1: Hero Section avec animations au chargement et au scroll
 */
export const HeroExample: React.FC = () => {
  const ctaRef = useFadeInOnScroll();

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="animate-fade-in-up">
          Bienvenue sur notre plateforme
        </h1>
        <p className="animate-fade-in-up-delay-100">
          Des animations fluides qui impressionnent vos utilisateurs
        </p>
        <div className="animate-fade-in-up-delay-200">
          <button className="hero__cta">Commencer</button>
        </div>
      </div>

      <div ref={ctaRef} className="scroll-animate-fade-scale hero__image">
        <img src="/hero.jpg" alt="Hero" />
      </div>
    </section>
  );
};

/**
 * Exemple 2: Liste de fonctionnalités avec cascade
 */
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeaturesExample: React.FC<{ features: Feature[] }> = ({ features }) => {
  return (
    <section className="features">
      <h2 className="animate-fade-in-up">Nos fonctionnalités</h2>
      
      <AnimatedList animationType="fadeScale" staggerDelay={120}>
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </AnimatedList>
    </section>
  );
};

/**
 * Exemple 3: Galerie d'images avec animations au scroll
 */
export const GalleryExample: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <section className="gallery">
      <h2 className="animate-fade-in-up">Galerie</h2>
      
      <div className="gallery__grid">
        {images.map((image, index) => (
          <AnimatedElement
            key={index}
            animationType="fadeScale"
            threshold={0.2}
          >
            <div className="gallery__item">
              <img src={image} alt={`Gallery ${index + 1}`} />
            </div>
          </AnimatedElement>
        ))}
      </div>
    </section>
  );
};

/**
 * Exemple 4: Carte client (testimonial) avec animation
 */
interface Testimonial {
  id: string;
  name: string;
  quote: string;
  image: string;
}

export const TestimonialCardExample: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  const cardRef = useFadeInOnScroll({ threshold: 0.3 });

  return (
    <div ref={cardRef} className="scroll-animate-fade-left testimonial-card">
      <div className="testimonial-content">
        <p className="testimonial-quote">"{testimonial.quote}"</p>
        <div className="testimonial-author">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="testimonial-avatar"
          />
          <h4>{testimonial.name}</h4>
        </div>
      </div>
    </div>
  );
};

/**
 * Exemple 5: Formulaire avec animations
 */
export const FormExample: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <section className="form-section">
      <h2 className="animate-fade-in-up">Contactez-nous</h2>

      {!submitted ? (
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}>
          <div className="form-group animate-fade-in-left" style={{ animationDelay: '0s' }}>
            <label>Nom</label>
            <input type="text" required />
          </div>

          <div className="form-group animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
            <label>Email</label>
            <input type="email" required />
          </div>

          <div className="form-group animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <label>Message</label>
            <textarea required></textarea>
          </div>

          <button
            type="submit"
            className="animate-fade-in-up-delay-300 form-submit"
          >
            Envoyer
          </button>
        </form>
      ) : (
        <div className="animate-fade-in success-message">
          <h3>✓ Merci!</h3>
          <p>Votre message a été envoyé avec succès.</p>
        </div>
      )}
    </section>
  );
};

/**
 * Exemple 6: Timeline avec animations
 */
interface TimelineItem {
  id: string;
  year: number;
  title: string;
  description: string;
}

export const TimelineExample: React.FC<{ items: TimelineItem[] }> = ({ items }) => {
  return (
    <section className="timeline">
      <h2 className="animate-fade-in-up">Notre histoire</h2>

      <div className="timeline__container">
        {items.map((item, index) => (
          <AnimatedElement
            key={item.id}
            animationType={index % 2 === 0 ? 'fadeLeft' : 'fadeRight'}
            threshold={0.4}
          >
            <div className="timeline__item">
              <div className="timeline__date">{item.year}</div>
              <div className="timeline__content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </AnimatedElement>
        ))}
      </div>
    </section>
  );
};

/**
 * Exemple 7: Statistiques avec animation de compte
 */
interface Stat {
  label: string;
  value: number;
}

export const StatsExample: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  const sectionRef = useFadeInOnScroll();

  return (
    <section ref={sectionRef} className="stats-section scroll-animate-fade">
      <h2>Nos résultats</h2>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card scroll-animate-fade-up"
            style={{
              opacity: 0,
              animation: `fadeInUp 0.8s ease-out ${(index + 1) * 0.15}s forwards`,
            }}
          >
            <div className="stat-value">{stat.value}+</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Exemple 8: Menu mobile avec animation
 */
interface MenuItem {
  label: string;
  href: string;
}

export const MobileMenuExample: React.FC<{ items: MenuItem[]; isOpen: boolean }> = ({
  items,
  isOpen,
}) => {
  return (
    <nav
      className={`mobile-menu ${isOpen ? 'animate-fade-in-down' : 'hidden'}`}
    >
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="mobile-menu__item animate-fade-in-left"
          style={{
            animationDelay: `${(index + 1) * 0.1}s`,
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

/**
 * Exemple 9: Notification/Toast avec animation
 */
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const ToastExample: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`toast toast--${type} ${visible ? 'animate-fade-in-right' : 'animate-fade-out-right'}`}
    >
      {message}
    </div>
  );
};

/**
 * Exemple 10: Accordéon avec animations
 */
interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export const AccordionExample: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="accordion">
      {items.map((item) => (
        <div key={item.id} className="accordion__item">
          <button
            className="accordion__header"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
          >
            {item.title}
            <span className="accordion__icon">
              {openId === item.id ? '−' : '+'}
            </span>
          </button>

          {openId === item.id && (
            <div className="accordion__content animate-fade-in-down">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from '../../App';
import { Header } from '../Header';
import { MobileMenu } from '../MobileMenu';
import { Hero } from '../Hero';
import { Projects } from '../Projects';
import { ProjectModal } from '../ProjectModal';
import { Explorations } from '../Explorations';
import { Resume } from '../Resume';
import { Contact } from '../Contact';
import { Footer } from '../Footer';
import { FallbackHero } from '../FallbackHero';
import { portfolioData } from '../../content/portfolio';

describe('Semantic UI and Responsive Layout Components', () => {
  describe('Header Component', () => {
    it('renders logo emblem, owner name, navigation links, and mobile menu button', () => {
      const html = renderToString(
        <Header isMenuOpen={false} onToggleMenu={() => {}} />
      );

      // Emblem & Name
      expect(html).toContain('route-emblem');
      expect(html).toContain('Nikhil Sharma');

      // Navigation links
      expect(html).toContain('Home');
      expect(html).toContain('Projects');
      expect(html).toContain('Résumé');
      expect(html).toContain('About');

      // Accessibility attributes
      expect(html).toContain('aria-label="Primary navigation"');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('aria-controls="mobile-nav-menu"');
    });

    it('updates aria-expanded when menu is open', () => {
      const html = renderToString(
        <Header isMenuOpen={true} onToggleMenu={() => {}} />
      );
      expect(html).toContain('aria-expanded="true"');
      expect(html).toContain('aria-label="Close navigation menu"');
    });
  });

  describe('MobileMenu Component', () => {
    it('renders dialog with modal accessibility attributes and destinations', () => {
      const html = renderToString(
        <MobileMenu isOpen={true} onClose={() => {}} />
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('id="mobile-nav-menu"');
      expect(html).toContain('aria-label="Mobile navigation menu"');

      // Destinations
      expect(html).toContain('Home');
      expect(html).toContain('Projects');
      expect(html).toContain('Résumé');
      expect(html).toContain('About');

      // Pace caption
      expect(html).toContain('EXPLORE AT YOUR OWN PACE');
    });

    it('renders null when closed', () => {
      const html = renderToString(
        <MobileMenu isOpen={false} onClose={() => {}} />
      );
      expect(html).toBe('');
    });
  });

  describe('Hero Component', () => {
    it('renders eyebrow, two-line headline, subhead, CTA, and lower-left route graphic', () => {
      const html = renderToString(<Hero />);

      expect(html).toContain('PERSONAL PORTFOLIO / 001');
      expect(html).toContain('WORK');
      expect(html).toContain('&amp; IDEAS.');
      expect(html).toContain('A collection of projects, ideas, and experiments.');
      expect(html).toContain('VIEW PROJECTS ↗');

      // Lower-left route line with caption
      expect(html).toContain('hero-route-indicator');
      expect(html).toContain('EXPLORE AT YOUR OWN PACE');

      // Desktop game controls and legend
      expect(html).toContain('DRONE VIEW');
      expect(html).toContain('START EXPLORING ↗');
      expect(html).toContain('WASD MOVE · SPACE JUMP · R RESET');

      // Mobile play CTA
      expect(html).toContain('PLAY THE COURSE ↗');

      // Scene labels
      expect(html).toContain('01 / WORK');
      expect(html).toContain('02 / EXPLORATIONS');
      expect(html).toContain('03 / RÉSUMÉ');
    });

    it('renders FallbackHero when no canvasSlot is provided', () => {
      const html = renderToString(<Hero />);
      expect(html).toContain('SCHEMATIC PREVIEW / 2D FALLBACK');
      expect(html).toContain('JUMP TO SECTION:');
    });

    it('renders provided canvasSlot when passed', () => {
      const html = renderToString(
        <Hero canvasSlot={<div id="test-3d-canvas">Canvas 3D Mock</div>} />
      );
      expect(html).toContain('test-3d-canvas');
      expect(html).toContain('Canvas 3D Mock');
    });
  });

  describe('FallbackHero Component', () => {
    it('renders architectural SVG schematic and direct section jump links', () => {
      const html = renderToString(<FallbackHero />);
      expect(html).toContain('fallback-hero');
      expect(html).toContain('fallback-svg');
      expect(html).toContain('01 / WORK ↗');
      expect(html).toContain('02 / EXPLORATIONS ↗');
      expect(html).toContain('03 / RÉSUMÉ ↗');
    });
  });

  describe('Projects Component', () => {
    it('renders selected projects section with 3 projects, thumbnails, and modal trigger', () => {
      const html = renderToString(<Projects />);

      expect(html).toContain('SELECTED PROJECTS');
      expect(html).toContain('01');
      expect(html).toContain('PROJECT ONE');
      expect(html).toContain('02');
      expect(html).toContain('PROJECT TWO');
      expect(html).toContain('03');
      expect(html).toContain('PROJECT THREE');

      // Accessibility role
      expect(html).toContain('role="button"');
      expect(html).toContain('aria-haspopup="dialog"');
    });
  });

  describe('ProjectModal Component', () => {
    it('renders project detail modal with challenge, approach, outcome, and tags', () => {
      const sampleProject = portfolioData.projects[0];
      const html = renderToString(
        <ProjectModal project={sampleProject} onClose={() => {}} />
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain(sampleProject.title);
      expect(html).toContain('THE CHALLENGE');
      expect(html).toContain(sampleProject.details.challenge);
      expect(html).toContain('OUR APPROACH');
      expect(html).toContain(sampleProject.details.approach);
      expect(html).toContain('KEY OUTCOME');
      expect(html).toContain(sampleProject.details.outcome);
      expect(html).toContain('SYSTEMS &amp; ARCHITECTURE');
    });
  });

  describe('Explorations Component', () => {
    it('renders technical explorations with status badges', () => {
      const html = renderToString(<Explorations />);

      expect(html).toContain('EXPLORATIONS / LAB');
      portfolioData.explorations.forEach((item) => {
        expect(html).toContain(item.title.replace('&', '&amp;'));
        expect(html).toContain(item.status);
      });
    });
  });

  describe('Resume Component', () => {
    it('renders experience timeline, skills, and education', () => {
      const html = renderToString(<Resume />);

      expect(html).toContain('RÉSUMÉ &amp; BACKGROUND');
      expect(html).toContain('EXPERIENCE');
      expect(html).toContain('TECHNICAL CAPABILITIES');
      expect(html).toContain('EDUCATION');

      // Confirms NO portrait image on landing page when resumePortraitUrl is undefined
      expect(html).not.toContain('resume-portrait-img');
    });
  });

  describe('Contact & Footer Components', () => {
    it('renders contact details and clean footer', () => {
      const contactHtml = renderToString(<Contact />);
      expect(contactHtml).toContain(portfolioData.contact.heading.replace('&', '&amp;'));
      expect(contactHtml).toContain(`mailto:${portfolioData.contact.emailPlaceholder}`);

      const footerHtml = renderToString(<Footer />);
      expect(footerHtml).toContain('Nearly 3 years');
      expect(footerHtml).toContain('mailto:nikhilmsha@gmail.com');
      expect(footerHtml).toContain('https://linkedin.com/in/nikhilmsha');
    });
  });

  describe('Full App Integration', () => {
    it('assembles all semantic sections with skip-link and proper landmark roles', () => {
      const html = renderToString(<App />);

      expect(html).toContain('skip-link');
      expect(html).toContain('role="banner"');
      expect(html).toContain('id="main-content"');
      expect(html).toContain('id="hero"');
      expect(html).toContain('id="work"');
      expect(html).toContain('id="explorations"');
      expect(html).toContain('id="resume"');
      expect(html).toContain('id="contact"');
      expect(html).toContain('role="contentinfo"');
    });
  });
});

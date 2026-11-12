import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from '../../App';
import PortfolioPages from '../../pages/PortfolioPages';
import { Header } from '../Header';
import { MobileMenu } from '../MobileMenu';
import { Footer } from '../Footer';
import { PhotoPlaceholder } from '../PhotoPlaceholder';
import { BenchmarkComparison } from '../BenchmarkComparison';
import { ProjectMetrics } from '../ProjectMetrics';
import { portfolioContent, projectsBySlug } from '../../content/realPortfolio';

describe('Semantic UI and Responsive Layout Components (T03)', () => {
  describe('Header Component', () => {
    it('renders owner name, navigation links, and mobile menu button', () => {
      const html = renderToString(
        <Header isMenuOpen={false} onToggleMenu={() => {}} />
      );

      expect(html).not.toContain('header-emblem');
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
      expect(html).toContain('>Nikhil Sharma</span>');
      expect(html).toContain('Projects');
      expect(html).toContain('Résumé');
      expect(html).toContain('About');

      expect(html).toContain('href="/blog"');
      expect(html).not.toContain('EXPLORE AT YOUR OWN PACE');
    });

    it('renders null when closed', () => {
      const html = renderToString(
        <MobileMenu isOpen={false} onClose={() => {}} />
      );
      expect(html).toBe('');
    });
  });

  describe('PhotoPlaceholder Component', () => {
    it('renders accessible passport-shaped frame without generating likeness', () => {
      const html = renderToString(<PhotoPlaceholder />);
      expect(html).toContain('role="img"');
      expect(html).toContain('aria-label="Photo placeholder (no portrait supplied)"');
      expect(html).toContain('photo-placeholder');
      expect(html).toContain('photo-frame');
    });
  });

  describe('BenchmarkComparison Component', () => {
    it('accurately renders 684 vs 539 microseconds and workload qualifier', () => {
      const html = renderToString(
        <BenchmarkComparison
          baselineMicroseconds={684}
          optimizedMicroseconds={539}
          reductionPercent={21}
          theoreticalPeakPercent={91}
          qualifier="Results refer to the primary benchmark workload, not a universal speedup."
        />
      );

      expect(html).toContain('684 µs');
      expect(html).toContain('539 µs');
      expect(html).toContain('21%');
      expect(html).toContain('~91%');
      expect(html).toContain('Results refer to the primary benchmark workload, not a universal speedup.');
      expect(html).toContain('OpenCV Baseline');
      expect(html).toContain('FastCode');
    });
  });

  describe('ProjectMetrics Component', () => {
    it('renders ScottyPi dataset metrics and evaluation qualifier', () => {
      const html = renderToString(
        <ProjectMetrics slug="scottypi" details={projectsBySlug.scottypi.details} />
      );

      expect(html).toContain('20');
      expect(html).toContain('133');
      expect(html).toContain('160');
      expect(html).toContain('Recall@1');
      expect(html).toContain('Recall@3');
      expect(html).toContain('MRR');
      expect(html).toContain('The questions were split into training, development, and test sets.');
    });

    it('renders Langmetric telemetry measures without fabricated revenue numbers', () => {
      const html = renderToString(
        <ProjectMetrics slug="langmetric" details={projectsBySlug.langmetric.details} />
      );

      expect(html).toContain('Latency distributions');
      expect(html).toContain('Token usage');
      expect(html).toContain('Cost');
      expect(html).toContain('Loco RS');
      expect(html).toContain('SeaORM');
    });
  });

  describe('PortfolioPages Route Views (T03)', () => {
    it('renders Home route with semantic main, identity, photo, project sentences, and gameSlot', () => {
      const customSlot = <div id="custom-test-slot">Interactive 3D Course</div>;
      const html = renderToString(<PortfolioPages path="/" gameSlot={customSlot} />);

      // Accessibility landmark
      expect(html).toContain('id="main-content"');
      expect(html).toContain('tabindex="-1"');

      // Identity & Intro
      expect(html).toContain('Nikhil Sharma');
      expect(html).toContain('Photo placeholder (no portrait supplied)');
      expect(html).toContain(portfolioContent.home.intro);
      expect(html).toContain('M.S. Software Engineering · Carnegie Mellon · Expected 2027');

      // 3 project preview sentences
      expect(html).toContain('Faster YOLOv8n convolution with AVX2/FMA.');
      expect(html).toContain('Hybrid retrieval over official CMU-SV pages.');
      expect(html).toContain('Latency, token usage, and cost from model traces.');

      // Game slot present on Home
      expect(html).toContain('custom-test-slot');
      expect(html).toContain('Interactive 3D Course');
    });

    it('renders fallback preview when gameSlot is not provided on Home', () => {
      const html = renderToString(<PortfolioPages path="/" />);
      expect(html).toContain('fallback-blueprint-graphic');
      expect(html).toContain('WASD MOVE · SPACE JUMP · R RESET');
    });

    it('renders Projects index (/projects) with all 3 project deep dives', () => {
      const html = renderToString(<PortfolioPages path="/projects" />);
      expect(html).toContain('<h1 class="page-main-title">Projects</h1>');
      expect(html).toContain('/projects/fastcode');
      expect(html).toContain('/projects/scottypi');
      expect(html).toContain('/projects/langmetric');
      // No game slot on text-only projects index
      expect(html).not.toContain('home-experience-slot');
    });

    it('renders FastCode project detail (/projects/fastcode) with benchmarks and code link', () => {
      const html = renderToString(<PortfolioPages path="/projects/fastcode" />);
      expect(html).toContain('CPU kernel optimization for YOLOv8n');
      expect(html).toContain('684 µs');
      expect(html).toContain('539 µs');
      expect(html).toContain('The problem');
      expect(html).toContain('~91%');
      expect(html).toContain('https://github.com/ni-ms/18645-yolov8n-optimization');
      expect(html).not.toContain('home-experience-slot');
    });

    it('renders ScottyPi project detail (/projects/scottypi) with no invented repo link', () => {
      const html = renderToString(<PortfolioPages path="/projects/scottypi" />);
      expect(html).toContain('Campus retrieval assistant');
      expect(html).toContain('133');
      expect(html).toContain('20');
      expect(html).toContain('160');
      expect(html).toContain('Reciprocal-rank fusion');
      // No fake repo link
      expect(html).not.toContain('https://github.com/ni-ms/scottypi');
      expect(html).not.toContain('home-experience-slot');
    });

    it('renders Langmetric project detail (/projects/langmetric) with live platform link', () => {
      const html = renderToString(<PortfolioPages path="/projects/langmetric" />);
      expect(html).toContain('Langmetric');
      expect(html).toContain('https://langmetric.com/');
      expect(html).toContain('Loco RS');
      expect(html).toContain('SeaORM');
      expect(html).not.toContain('home-experience-slot');
    });

    it('renders Résumé route (/resume) with employer/client relationships and download links', () => {
      const html = renderToString(<PortfolioPages path="/resume" />);
      expect(html).toContain('Tech Mahindra');
      expect(html).toContain('Intuitive Surgical');
      expect(html).toContain('Styrone');
      expect(html).toContain('Nationwide Building Society');
      expect(html).toContain('Exeevo');
      expect(html).toContain('Carnegie Mellon University');
      expect(html).toContain('BITS Pilani');
      expect(html).toContain('Privacy-preserving shared memory for LLM agents');
      expect(html).toContain('In review');
      expect(html).toContain('/resume/Nikhil_Sharma_Resume.pdf');
      expect(html).toContain('/resume/Nikhil_Sharma_Resume.docx');
    });

    it('renders About route (/about) with #contact section and direct contact links', () => {
      const html = renderToString(<PortfolioPages path="/about" />);
      expect(html).toContain('id="contact"');
      expect(html).toContain('mailto:nikhilmsha@gmail.com');
      expect(html).toContain('https://github.com/ni-ms');
      expect(html).toContain('https://linkedin.com/in/nikhilmsha');
      expect(html).toContain('Areas of focus');
      expect(html).toContain('Get in touch');
    });

    it('renders 404 page for unknown routes with navigation back links', () => {
      const html = renderToString(<PortfolioPages path="/nonexistent-path" />);
      expect(html).toContain('Page Not Found');
      expect(html).toContain('aria-hidden="true">404</div>');
      expect(html).toContain('Return to Home →');
      expect(html).toContain('Explore Selected Projects →');
    });
  });

  describe('Mounted application shell', () => {
    it('mounts factual Home in a single main landmark with shared navigation', () => {
      const html = renderToString(<App />);
      expect((html.match(/<main /g) || []).length).toBe(1);
      expect(html).toContain('id="main-content"');
      expect(html).toContain('Skip to main content');
      expect(html).toContain('Nikhil Sharma');
      expect(html).toContain('FastCode');
      expect(html).not.toContain('YOUR NAME');
      expect(html).not.toContain('PROJECT ONE');
      expect(html).not.toContain('Portfolio content is being integrated');
    });
    it('renders confirmed footer contact channels', () => {
      const html = renderToString(<Footer />);
      expect(html).toContain('mailto:nikhilmsha@gmail.com');
      expect(html).toContain('https://github.com/ni-ms');
      expect(html).toContain('https://linkedin.com/in/nikhilmsha');
    });
  });
});

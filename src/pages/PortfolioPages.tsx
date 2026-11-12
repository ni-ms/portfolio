import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { useHeadingReveals } from '../motion/useHeadingReveals';
import { useReducedMotion } from '../motion/reducedMotion';
import '../styles/pages.css';
import '../styles/motion.css';
import '../styles/portfolio-grid.css';
import { HomePage } from './HomePage';
import { ProjectsPage } from './ProjectsPage';
import { ProjectDetailPage } from './ProjectDetailPage';
import { ResumePage } from './ResumePage';
import { BlogPage } from './BlogPage';
import { blogPosts } from '../content/blogPosts';
import { AboutPage } from './AboutPage';
import { NotFoundPage } from './NotFoundPage';
import { getProjectBySlug, ProjectSlug } from '../content/realPortfolio';

export interface PortfolioPagesProps {
  path: string;
  gameSlot?: ReactNode;
}

/**
 * PortfolioPages - Unified route view component conforming to T03 & T07 contracts.
 *
 * Owns route page markup including main#main-content tabIndex={-1}.
 * Coordinates restrained, purposeful motion and cleans up timelines on route changes.
 * Renders the portfolio, blog, and accessible 404:
 *   - / (Home, reserves gameSlot)
 *   - /projects (Projects index)
 *   - /projects/fastcode (FastCode detail)
 *   - /projects/scottypi (ScottyPi detail)
 *   - /projects/langmetric (Langmetric detail)
 *   - /blog and /blog/:slug
 *   - /resume (Résumé & Background)
 *   - /about (About & Contact)
 *   - [unknown] (Accessible 404 page)
 *
 * Game runs strictly on Home; inner pages are clean and text-focused without game simulation.
 */
export default function PortfolioPages({ path, gameSlot }: PortfolioPagesProps) {
  // Normalize path (strip trailing slash if length > 1)
  const normalizedPath = path.length > 1 ? path.replace(/\/$/, '') : path;

  const mainRef = useRef<HTMLElement>(null);
  useHeadingReveals(mainRef, normalizedPath);
  const previousPath = useRef(normalizedPath);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const changedPage = previousPath.current !== normalizedPath;
    previousPath.current = normalizedPath;
    const main = mainRef.current;
    if (!changedPage || reducedMotion || !main) return;

    // Keep Home's pinned scene and fragment targets in their original coordinates.
    const slide = normalizedPath !== '/' && !window.location.hash;
    const motion = gsap.context(() => {
      gsap.fromTo(main, {
        opacity: 0.58,
        ...(slide ? { y: 8 } : {}),
      }, {
        opacity: 1,
        ...(slide ? { y: 0 } : {}),
        duration: 0.24,
        ease: 'power2.out',
        clearProps: slide ? 'opacity,transform' : 'opacity',
      });
    }, main);

    return () => motion.revert();
  }, [normalizedPath, reducedMotion]);

  const renderContent = () => {
    if (normalizedPath === '/') {
      return <HomePage gameSlot={gameSlot} />;
    }

    if (normalizedPath === '/projects') {
      return <ProjectsPage />;
    }

    if (normalizedPath.startsWith('/projects/')) {
      const slug = normalizedPath.slice('/projects/'.length) as ProjectSlug;
      const project = getProjectBySlug(slug);
      if (project) {
        return <ProjectDetailPage project={project} />;
      }
      return <NotFoundPage path={normalizedPath} />;
    }

    if (normalizedPath === '/blog') {
      return <BlogPage />;
    }

    if (normalizedPath.startsWith('/blog/')) {
      const post = blogPosts.find((entry) => normalizedPath === `/blog/${entry.slug}`);
      return post ? <BlogPage post={post} /> : <NotFoundPage path={normalizedPath} />;
    }

    if (normalizedPath === '/resume') {
      return <ResumePage />;
    }

    if (normalizedPath === '/about') {
      return <AboutPage />;
    }

    return <NotFoundPage path={normalizedPath} />;
  };

  return (
    <main ref={mainRef} id="main-content" tabIndex={-1} className="portfolio-main">
      {renderContent()}
    </main>
  );
}

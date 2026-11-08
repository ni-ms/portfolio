import { ReactNode } from 'react';
import '../styles/pages.css';
import { HomePage } from './HomePage';
import { ProjectsPage } from './ProjectsPage';
import { ProjectDetailPage } from './ProjectDetailPage';
import { ResumePage } from './ResumePage';
import { AboutPage } from './AboutPage';
import { NotFoundPage } from './NotFoundPage';
import { getProjectBySlug, ProjectSlug } from '../content/realPortfolio';

export interface PortfolioPagesProps {
  path: string;
  gameSlot?: ReactNode;
}

/**
 * PortfolioPages - Unified route view component conforming to T03 contract.
 *
 * Owns route page markup including main#main-content tabIndex={-1}.
 * Renders the 7 approved routes + real 404:
 *   - / (Home, reserves gameSlot)
 *   - /projects (Projects index)
 *   - /projects/fastcode (FastCode detail)
 *   - /projects/scottypi (ScottyPi detail)
 *   - /projects/langmetric (Langmetric detail)
 *   - /resume (Résumé & Background)
 *   - /about (About & Contact)
 *   - [unknown] (Accessible 404 page)
 *
 * Game runs strictly on Home; inner pages are clean and text-focused without game simulation.
 */
export default function PortfolioPages({ path, gameSlot }: PortfolioPagesProps) {
  // Normalize path (strip trailing slash if length > 1)
  const normalizedPath = path.length > 1 ? path.replace(/\/$/, '') : path;

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

    if (normalizedPath === '/resume') {
      return <ResumePage />;
    }

    if (normalizedPath === '/about') {
      return <AboutPage />;
    }

    return <NotFoundPage path={normalizedPath} />;
  };

  return (
    <main id="main-content" tabIndex={-1} className="portfolio-main">
      {renderContent()}
    </main>
  );
}

import { useRef } from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { ProjectCard } from '../components/ProjectCard';
import { useProjectsMotion } from '../motion/useProjectsMotion';
import '../styles/projects-index.css';

export function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useProjectsMotion(pageRef);
  const { projects } = portfolioContent;
  const [featuredProject, ...supportingProjects] = projects;

  return (
    <div className="portfolio-page portfolio-frame projects-page-container" ref={pageRef}>
      <header className="portfolio-cell page-intro-header" data-projects-intro>
        <h1 className="page-main-title">Projects</h1>

        <p className="page-intro-description">
          A closer look at my work in systems, applied AI, and backend engineering.
        </p>
      </header>

      <section className="portfolio-row projects-featured-section" aria-label="Featured project" data-projects-feature>
        <ProjectCard project={featuredProject} variant="featured" />
      </section>

      <section className="portfolio-row projects-supporting-section" aria-label="Supporting projects" data-projects-supporting>
        <div className="projects-supporting-grid">
          {supportingProjects.map((project) => (
            <div className="projects-folder-item" key={project.slug}>
              <span className="projects-folder-tab" aria-hidden="true" />
              <ProjectCard project={project} variant="full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

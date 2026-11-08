import React from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { ProjectCard } from '../components/ProjectCard';

export const ProjectsPage: React.FC = () => {
  const { projects } = portfolioContent;
  const featuredProject = projects[0]; // FastCode
  const supportingProjects = projects.slice(1); // ScottyPi & Langmetric

  return (
    <div className="projects-page-container">
      {/* Header */}
      <header className="page-intro-header">
        <div className="page-meta-eyebrow">
          <span className="eyebrow-accent">PORTFOLIO</span>
          <span className="eyebrow-sep">/</span>
          <span>SELECTED PROJECTS</span>
        </div>

        <h1 className="page-main-title">Technical Projects &amp; Systems</h1>

        <p className="page-intro-description">
          Focused implementations in CPU kernel optimization, hybrid retrieval systems, and real-time model telemetry. Built with measurable performance benchmarks, strict factual evaluation, and production engineering practices.
        </p>
      </header>

      {/* Featured Project Row (FastCode) */}
      <section className="projects-featured-section" aria-label="Featured project">
        <ProjectCard project={featuredProject} variant="featured" />
      </section>

      {/* Supporting Projects Grid (ScottyPi & Langmetric) */}
      <section className="projects-supporting-section" aria-label="Supporting projects">
        <div className="projects-supporting-grid">
          {supportingProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant="full"
            />
          ))}
        </div>
      </section>

      {/* Cross-Link to Resume */}
      <aside className="projects-bottom-callout">
        <div className="callout-inner">
          <div className="callout-text">
            <h2 className="callout-title">Looking for professional employment history?</h2>
            <p className="callout-sub">
              Review full enterprise experience at Tech Mahindra (Intuitive Surgical), Styrone (Nationwide Building Society), and Exeevo.
            </p>
          </div>
          <a href="/resume" className="cta-btn cta-btn-secondary">
            View Résumé →
          </a>
        </div>
      </aside>
    </div>
  );
};

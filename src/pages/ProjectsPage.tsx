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
        <h1 className="page-main-title">Projects</h1>

        <p className="page-intro-description">
          A closer look at my work in systems, applied AI, and backend engineering.
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

    </div>
  );
};

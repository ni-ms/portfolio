import React from 'react';
import { PortfolioProject } from '../content/realPortfolio';

interface ProjectCardProps {
  project: PortfolioProject;
  featured?: boolean;
}

const thumbnailMap: Record<string, string> = {
  fastcode: '/images/projects/fastcode-architecture.svg',
  scottypi: '/images/projects/scottypi-pipeline.svg',
  langmetric: '/images/projects/langmetric-telemetry.svg',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const thumbnailSrc = thumbnailMap[project.slug];

  return (
    <article
      className={`portfolio-project-card ${featured ? 'is-featured' : ''}`}
      aria-labelledby={`project-card-heading-${project.slug}`}
    >
      {/* Project Thumbnail Visual */}
      <a
        href={`/projects/${project.slug}`}
        className="card-media-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="card-media-wrapper">
          <img
            src={thumbnailSrc}
            alt=""
            className="card-media-img"
            loading="lazy"
          />
          <div className="card-media-overlay">
            <span className="card-explore-pill">VIEW PROJECT ↗</span>
          </div>
        </div>
      </a>

      {/* Card Content */}
      <div className="card-content-body">
        <div className="card-meta-row">
          <span className="card-project-number">{project.number}</span>
          <span className="card-meta-dot" aria-hidden="true">·</span>
          <span className="card-category">{project.category}</span>
          <span className="card-meta-dot" aria-hidden="true">·</span>
          <span className="card-dates">{project.dates}</span>
        </div>

        <h3 id={`project-card-heading-${project.slug}`} className="card-title">
          <a href={`/projects/${project.slug}`} className="card-title-link">
            {project.name}
          </a>
        </h3>

        <p className="card-subtitle">{project.subtitle}</p>

        {/* Factual balanced sentence description */}
        <p className="card-description">{project.description}</p>

        {/* Highlighted Result / Benchmark outcome */}
        <div className="card-result-callout">
          <span className="result-label" aria-hidden="true">RESULT:</span>
          <span className="result-text">{project.result}</span>
        </div>

        {/* Tags */}
        <div className="card-tags-list" aria-label="Project technologies">
          {project.tags.map((tag) => (
            <span key={tag} className="card-tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="card-actions-row">
          <a
            href={`/projects/${project.slug}`}
            className="card-primary-cta"
            aria-label={`View technical deep dive for ${project.name}`}
          >
            Technical Deep Dive →
          </a>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="card-external-link"
              aria-label={`${project.urlLabel || 'Visit project'} (opens in a new tab)`}
            >
              {project.urlLabel || 'External Link ↗'}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

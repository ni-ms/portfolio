import React from 'react';
import { PortfolioProject } from '../content/realPortfolio';

interface ProjectCardProps {
  project: PortfolioProject;
  variant?: 'compact' | 'full' | 'featured';
}

const thumbnailMap: Record<string, string> = {
  fastcode: '/images/projects/fastcode-architecture.svg',
  scottypi: '/images/projects/scottypi-pipeline.svg',
  langmetric: '/images/projects/langmetric-telemetry.svg',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'full',
}) => {
  const thumbnailSrc = thumbnailMap[project.slug];

  // Compact variant for Home page: Image, Name, Category, One-sentence description, Deep-dive link
  if (variant === 'compact') {
    return (
      <article
        className="portfolio-project-card is-compact"
        data-project-slug={project.slug}
        data-testid={`project-card-${project.slug}`}
        aria-labelledby={`project-card-heading-${project.slug}`}
      >
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

        <div className="card-content-body">
          <div className="card-meta-row">
            <span className="card-project-number">{project.number}</span>
            <span className="card-meta-dot" aria-hidden="true">·</span>
            <span className="card-category">{project.category}</span>
          </div>

          <h3 id={`project-card-heading-${project.slug}`} className="card-title">
            <a href={`/projects/${project.slug}`} className="card-title-link">
              {project.name}
            </a>
          </h3>

          {/* Factual single descriptive sentence */}
          <p className="card-description">{project.description}</p>

          <div className="card-actions-row">
            <a
              href={`/projects/${project.slug}`}
              className="card-primary-cta"
              aria-label={`View technical deep dive for ${project.name}`}
            >
              Technical Deep Dive →
            </a>
          </div>
        </div>
      </article>
    );
  }

  // Featured variant for Projects Index (top full-width row)
  if (variant === 'featured') {
    return (
      <article
        className="portfolio-project-card is-featured-row"
        data-project-slug={project.slug}
        data-testid={`project-card-${project.slug}`}
        aria-labelledby={`project-card-heading-${project.slug}`}
      >
        <a
          href={`/projects/${project.slug}`}
          className="card-media-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="card-media-wrapper featured-media">
            <img
              src={thumbnailSrc}
              alt=""
              className="card-media-img"
              loading="lazy"
            />
          </div>
        </a>

        <div className="card-content-body">
          <div className="card-meta-row">
            <span className="card-project-number">{project.number}</span>
            <span className="card-meta-dot" aria-hidden="true">·</span>
            <span className="card-category">{project.category}</span>
            <span className="card-meta-dot" aria-hidden="true">·</span>
            <span className="card-dates">{project.dates}</span>
          </div>

          <h3 id={`project-card-heading-${project.slug}`} className="card-title featured-title">
            <a href={`/projects/${project.slug}`} className="card-title-link">
              {project.name}
            </a>
          </h3>

          <p className="card-subtitle">{project.subtitle}</p>

          <p className="card-description">{project.description}</p>

          <div className="card-result-callout">
            <span className="result-label" aria-hidden="true">RESULT:</span>
            <span className="result-text">{project.result}</span>
          </div>

          <div className="card-tags-list" aria-label="Technologies used">
            {project.tags.map((tag) => (
              <span key={tag} className="card-tag-pill">
                {tag}
              </span>
            ))}
          </div>

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
              >
                {project.urlLabel || 'External Link ↗'}
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Standard full card
  return (
    <article
      className="portfolio-project-card is-standard"
      data-project-slug={project.slug}
      data-testid={`project-card-${project.slug}`}
      aria-labelledby={`project-card-heading-${project.slug}`}
    >
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
        </div>
      </a>

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

        <p className="card-description">{project.description}</p>

        <div className="card-result-callout">
          <span className="result-label" aria-hidden="true">RESULT:</span>
          <span className="result-text">{project.result}</span>
        </div>

        <div className="card-tags-list" aria-label="Technologies used">
          {project.tags.map((tag) => (
            <span key={tag} className="card-tag-pill">
              {tag}
            </span>
          ))}
        </div>

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
            >
              {project.urlLabel || 'External Link ↗'}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

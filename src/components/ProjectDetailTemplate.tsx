import React from 'react';
import { PortfolioProject, portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { BenchmarkComparison } from './BenchmarkComparison';
import { ProjectMetrics } from './ProjectMetrics';

interface ProjectDetailTemplateProps {
  project: PortfolioProject;
}

const illustrationMap: Record<string, { src: string; alt: string }> = {
  fastcode: {
    src: '/images/projects/fastcode-architecture.svg',
    alt: 'FastCode CPU kernel architecture diagram showing input packing, AVX2 FMA registers, and benchmark outcome',
  },
  scottypi: {
    src: '/images/projects/scottypi-pipeline.svg',
    alt: 'ScottyPi hybrid retrieval architecture diagram showing CMU-SV corpus, BM25, dense retrieval, and RRF evaluation',
  },
  langmetric: {
    src: '/images/projects/langmetric-telemetry.svg',
    alt: 'Langmetric model trace telemetry pipeline diagram showing structured ingest, Rust service, and dashboard measures',
  },
};

export const ProjectDetailTemplate: React.FC<ProjectDetailTemplateProps> = ({ project }) => {
  const allProjects = portfolioContent.projects;
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const illustration = illustrationMap[project.slug];

  return (
    <article
      className="project-detail-container"
      data-project-slug={project.slug}
      aria-labelledby="project-title"
    >
      {/* Top Breadcrumb Nav */}
      <nav className="detail-breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/projects" className="detail-back-link">
          ← Back to Projects
        </a>
      </nav>

      {/* Split Hero Header: Left Copy + Right Illustration */}
      <header className="detail-split-hero">
        <div className="detail-hero-left">
          <div className="detail-identity-badge">
            <PhotoPlaceholder className="detail-photo" />
            <div className="detail-identity-meta">
              <span className="detail-author-name">{portfolioContent.identity.name}</span>
              <span className="detail-author-title">{portfolioContent.identity.title}</span>
            </div>
          </div>

          <div className="detail-meta-eyebrow">
            <span className="detail-project-number">{project.number}</span>
            <span className="detail-meta-divider" aria-hidden="true">/</span>
            <span className="detail-project-category">{project.category}</span>
            <span className="detail-meta-divider" aria-hidden="true">·</span>
            <span className="detail-project-dates">{project.dates}</span>
          </div>

          <h1 id="project-title" className="detail-title">
            {project.title}
          </h1>

          <p className="detail-subtitle">{project.subtitle}</p>

          <p className="detail-lead-summary">{project.details.fullSummary || project.description}</p>

          <div className="detail-tags-row" aria-label="Technologies used">
            {project.tags.map((tag) => (
              <span key={tag} className="detail-tag-pill">
                {tag}
              </span>
            ))}
          </div>

          {project.url && (
            <div className="detail-action-links">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="detail-cta-button"
              >
                {project.urlLabel || 'Visit Project ↗'}
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Technical Architecture Illustration */}
        {illustration && (
          <div className="detail-hero-right">
            <figure
              className="detail-illustration-figure"
              data-testid="detail-illustration-figure"
              data-project-slug={project.slug}
            >
              <img
                src={illustration.src}
                alt={illustration.alt}
                className="detail-illustration-img"
                loading="eager"
              />
              <figcaption className="detail-illustration-caption">
                Figure {project.number}.1 — Architectural schematic and pipeline overview for {project.name}.
              </figcaption>
            </figure>
          </div>
        )}
      </header>

      {/* Structured Content Grid: Challenge & Approach beside Outcomes */}
      <div className="detail-grid-layout">
        {/* Left Column: Challenge & Systems Approach */}
        <section className="detail-narrative-col" aria-label="Technical Details">
          <div className="detail-block">
            <h2 className="detail-section-heading">The Challenge</h2>
            <p className="detail-prose-text">{project.details.problem}</p>
          </div>

          <div className="detail-block">
            <h2 className="detail-section-heading">Approach &amp; Systems Architecture</h2>
            <ul className="detail-approach-list">
              {project.details.approach.map((item, idx) => (
                <li key={idx} className="detail-approach-item">
                  <span className="approach-bullet-mark" aria-hidden="true">■</span>
                  <span>{item}</span>
                </li>
              ))
            }</ul>
          </div>
        </section>

        {/* Right Column: HTML Benchmarks / Real Metrics */}
        <section className="detail-metrics-col" aria-label="Benchmark and Outcome Metrics">
          {project.slug === 'fastcode' ? (
            <BenchmarkComparison
              baselineMicroseconds={project.details.baselineMicroseconds}
              optimizedMicroseconds={project.details.optimizedMicroseconds}
              reductionPercent={project.details.reductionPercent}
              theoreticalPeakPercent={project.details.theoreticalSingleCorePeakPercent}
              qualifier={project.details.qualifier}
            />
          ) : (
            <ProjectMetrics slug={project.slug} details={project.details} />
          )}
        </section>
      </div>

      {/* Prev / Next Project Navigation Bar */}
      <footer className="detail-pagination-footer" aria-label="Projects navigation">
        <div className="pagination-inner">
          <a href={`/projects/${prevProject.slug}`} className="pagination-link prev-link">
            <span className="pagination-sub">← Previous Project</span>
            <span className="pagination-name">{prevProject.name}</span>
          </a>
          <a href="/projects" className="pagination-link all-link">
            <span className="pagination-sub">All Projects</span>
            <span className="pagination-name">Index (3)</span>
          </a>
          <a href={`/projects/${nextProject.slug}`} className="pagination-link next-link">
            <span className="pagination-sub">Next Project →</span>
            <span className="pagination-name">{nextProject.name}</span>
          </a>
        </div>
      </footer>
    </article>
  );
};

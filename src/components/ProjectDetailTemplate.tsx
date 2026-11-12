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
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const illustration = illustrationMap[project.slug];
  const isFastCode = project.slug === 'fastcode';
  const fastCodeApproach = [
    'Use AVX2 and FMA instructions to compute more values per cycle.',
    'Keep partial results in registers to reduce memory accesses.',
    'Rearrange inputs to improve cache locality during computation.',
  ];

  return (
    <article
      className="project-detail-container"
      data-project-slug={project.slug}
      aria-labelledby="project-title"
    >
      {/* Top Breadcrumb Nav */}
      <nav className="detail-breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/projects" className="detail-back-link">
          Projects
        </a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{project.name}</span>
      </nav>

      {/* Split Hero Header: Left Copy + Right Illustration */}
      <header className="detail-split-hero">
        <div className="detail-hero-left">
          <div className="detail-identity-badge">
            <PhotoPlaceholder className="detail-photo" />
            <div className="detail-identity-meta">
              <span className="detail-author-name">{portfolioContent.identity.name}</span>
            </div>
          </div>

          <h1 id="project-title" className="detail-title">
            {project.name}
          </h1>

          <p className="detail-subtitle">{isFastCode ? 'CPU kernel optimization for YOLOv8n' : project.subtitle}</p>

          <p className="detail-lead-summary">{isFastCode
            ? 'Optimizing FP32 1×1 convolution with vector instructions, register blocking, and cache-aware input packing.'
            : project.description}</p>
          <p className="detail-project-facts">{project.dates} · {project.stack}</p>

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
            </figure>
          </div>
        )}
      </header>

      {/* Structured Content Grid: Challenge & Approach beside Outcomes */}
      <div className="detail-grid-layout">
        {/* Left Column: Challenge & Systems Approach */}
        <section className="detail-narrative-col" aria-label="Technical Details">
          <div className="detail-block">
            <h2 className="detail-section-heading">The problem</h2>
            <p className="detail-prose-text">{project.details.problem}</p>
          </div>

          <div className="detail-block">
            <h2 className="detail-section-heading">The approach</h2>
            <ol className="detail-approach-list">
              {project.details.approach.map((item, idx) => (
                <li key={idx} className="detail-approach-item">
                  <span className="approach-bullet-mark" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item}</strong>
                    {isFastCode && <p>{fastCodeApproach[idx]}</p>}
                  </div>
                </li>
              ))
            }</ol>
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

      <footer className="detail-pagination-footer" aria-label="Projects navigation">
        {isFastCode && (
          <div>
            <h2 className="portfolio-section-heading">What this demonstrates</h2>
            <p>Low-level performance work across vectorization, data layout, and CPU efficiency.</p>
          </div>
        )}
        <a href={`/projects/${nextProject.slug}`} className="detail-next-link">
          Next project · {nextProject.name} →
        </a>
      </footer>
    </article>
  );
};

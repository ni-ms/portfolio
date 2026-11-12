import type { PortfolioProject } from '../content/realPortfolio';

interface ProjectCardProps {
  project: PortfolioProject;
  variant?: 'compact' | 'full' | 'featured';
}

const art = {
  fastcode: '/images/projects/fastcode-architecture.svg',
  scottypi: '/images/projects/scottypi-pipeline.svg',
  langmetric: '/images/projects/langmetric-telemetry.svg',
};

const previews = {
  fastcode: 'Faster YOLOv8n convolution with AVX2/FMA.',
  scottypi: 'Hybrid retrieval over official CMU-SV pages.',
  langmetric: 'Latency, token usage, and cost from model traces.',
};

export function ProjectCard({ project, variant = 'full' }: ProjectCardProps) {
  const { slug, name, subtitle, description, stack, url, dates } = project;
  const href = `/projects/${slug}`;
  const featured = variant === 'featured';
  const compact = variant === 'compact';
  const headingId = `project-card-heading-${slug}`;
  return (
    <article
      className={`portfolio-project-card ${featured ? 'is-featured-row' : compact ? 'is-compact' : 'is-standard'}`}
      data-project-slug={slug}
      data-testid={`project-card-${slug}`}
      aria-labelledby={headingId}
    >
      <a href={href} className="card-media-link" tabIndex={-1} aria-hidden="true">
        <div className={`card-media-wrapper${featured ? ' featured-media' : ''}`}>
          <img src={art[slug]} alt="" className="card-media-img" loading="lazy" />
        </div>
      </a>
      <div className="card-content-body">
        {featured && <p className="card-meta-row">Systems / {dates}</p>}
        <h3 id={headingId} className={`card-title${featured ? ' featured-title' : ''}`}>
          <a href={href} className="card-title-link">{name}</a>
        </h3>
        {!compact && <p className="card-subtitle">{subtitle}</p>}
        <p className="card-description">{compact ? previews[slug] : description}</p>
        {!compact && (
          <>
            {slug === 'fastcode' && (
              <div className="card-result-callout">
                <strong>21% lower latency vs OpenCV</strong>
                <span>Primary workload · 684 → 539 µs</span>
              </div>
            )}
            {slug === 'scottypi' && (
              <div className="card-result-callout"><strong>Evaluated on 160 questions.</strong></div>
            )}
            <p className="card-stack">{stack}</p>
            <div className="card-actions-row">
              <a href={href} className="card-primary-cta" aria-label={`View project ${name}`}>View project →</a>
              {url && (
                <a href={url} target="_blank" rel="noreferrer" className="card-external-link">
                  {slug === 'fastcode' ? 'GitHub ↗' : 'Visit site ↗'}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

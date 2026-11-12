import { sitePath } from '../routing/sitePath';
import type { PortfolioProject } from '../content/realPortfolio';
import { useTheme } from '../theme/ThemeProvider';

interface ProjectCardProps {
  project: PortfolioProject;
  variant?: 'compact' | 'full' | 'featured' | 'landing';
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
  const { slug, name, subtitle, description, stack, url, dates, details } = project;
  const { theme } = useTheme();
  const href = `/projects/${slug}`;
  const featured = variant === 'featured';
  const landing = variant === 'landing';
  const compact = variant === 'compact' || landing;
  const useDiagram = variant === 'compact';
  const fastCode = slug === 'fastcode';
  const headingId = `project-card-heading-${slug}`;
  const image = useDiagram ? art[slug] : `/images/projects/approved/${slug}-${theme}.jpg`;
  return (
    <article
      className={`portfolio-project-card ${featured ? 'is-featured-row' : compact ? 'is-compact' : 'is-standard'}`}
      data-project-slug={slug}
      data-testid={`project-card-${slug}`}
      aria-labelledby={headingId}
    >
      <a href={sitePath(href)} className="card-media-link" tabIndex={-1} aria-hidden="true">
        <div className={`card-media-wrapper${featured ? ' featured-media' : ''}`}>
          <img
            src={sitePath(image)}
            alt=""
            className="card-media-img"
            width={useDiagram ? undefined : fastCode ? 562 : 460}
            height={useDiagram ? undefined : fastCode ? 450 : 235}
            loading={featured ? 'eager' : 'lazy'}
            fetchPriority={featured ? 'high' : undefined}
          />
        </div>
      </a>
      <div className="card-content-body">
        {featured && <p className="card-meta-row">Systems / {dates.replace(' – ', '–')}</p>}
        <h3 id={headingId} className={`card-title${featured ? ' featured-title' : ''}`}>
          <a href={sitePath(href)} className="card-title-link">{name}{landing && <span aria-hidden="true">↗</span>}</a>
        </h3>
        {!compact && <p className="card-subtitle">{subtitle}</p>}
        <p className="card-description">{compact ? previews[slug] : description}</p>
        {!compact && (
          <>
            {slug === 'fastcode' && (
              <div className="card-result-callout">
                <strong>{details.reductionPercent}% lower latency vs OpenCV</strong>
                <span>Primary workload · {details.baselineMicroseconds} → {details.optimizedMicroseconds} µs</span>
              </div>
            )}
            {slug === 'scottypi' && (
              <div className="card-result-callout"><strong>Evaluated on {details.evaluationQuestions} questions.</strong></div>
            )}
            <div className="card-project-links">
              <p className="card-stack">{stack}</p>
              <div className="card-actions-row">
                <a href={sitePath(href)} className="card-primary-cta" aria-label={`View project ${name}`}>View project →</a>
                {url && (
                  <a href={url} target="_blank" rel="noreferrer" className="card-external-link">
                    {slug === 'fastcode' ? 'GitHub ↗' : 'Visit site ↗'}
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

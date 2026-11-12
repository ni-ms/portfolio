import React from 'react';
import { ProjectDetails } from '../content/realPortfolio';

interface ProjectMetricsProps {
  slug: 'scottypi' | 'langmetric';
  details: ProjectDetails;
  className?: string;
}

/**
 * Real HTML/CSS structured metrics cards for ScottyPi and Langmetric.
 * Avoids internal verification/provenance copy and displays factual evaluation and telemetry measures.
 */
export const ProjectMetrics: React.FC<ProjectMetricsProps> = ({
  slug,
  details,
  className = '',
}) => {
  if (slug === 'scottypi') {
    return (
      <div className={`project-metrics-card scottypi-metrics ${className}`} role="region" aria-label="Evaluation Measures">
        <div className="metrics-header">
          <div className="metrics-title-wrap">
            <span className="benchmark-badge-indicator" aria-hidden="true" />
            <h3 className="metrics-heading">Retrieval evaluation</h3>
          </div>
          <span className="metrics-target-pill">CMU-SV Official Pages</span>
        </div>

        <div className="metrics-stat-grid">
          <div className="metric-box">
            <span className="metric-value">{details.officialCmuSvPages ?? 20}</span>
            <span className="metric-label">Official CMU-SV pages</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{details.passages ?? 133}</span>
            <span className="metric-label">Passages indexed</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{details.evaluationQuestions ?? 160}</span>
            <span className="metric-label">Evaluation questions</span>
          </div>
        </div>

        <div className="metric-pills-row">
          <span className="metric-pills-label">Ranking metrics</span>
          {details.metrics?.map((m) => (
            <span key={m} className="metric-pill">
              {m}
            </span>
          ))}
        </div>

        {details.qualifier && (
          <p className="benchmark-qualifier">
            <span className="qualifier-mark" aria-hidden="true">ℹ</span>
            <span className="qualifier-text">{details.qualifier}</span>
          </p>
        )}
      </div>
    );
  }

  // Langmetric
  return (
    <div className={`project-metrics-card langmetric-metrics ${className}`} role="region" aria-label="Telemetry Measures">
      <div className="metrics-header">
        <div className="metrics-title-wrap">
          <span className="benchmark-badge-indicator" aria-hidden="true" />
          <h3 className="metrics-heading">What the dashboard tracks</h3>
        </div>
        <span className="metrics-target-pill">Rust Ingestion Engine</span>
      </div>

      <div className="metrics-stat-grid">
        <div className="metric-box">
          <span className="metric-value">Real-Time</span>
          <span className="metric-label">Trace Rollups</span>
        </div>
        <div className="metric-box">
          <span className="metric-value">Loco RS</span>
          <span className="metric-label">Web Framework</span>
        </div>
        <div className="metric-box">
          <span className="metric-value">SeaORM</span>
          <span className="metric-label">Async Database Layer</span>
        </div>
      </div>

      <div className="metric-pills-row">
        <span className="metric-pills-label">Dashboard Telemetry:</span>
        {details.dashboardMeasures?.map((measure) => (
          <span key={measure} className="metric-pill highlight-pill">
            {measure}
          </span>
        ))}
      </div>

    </div>
  );
};

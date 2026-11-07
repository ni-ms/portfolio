import React from 'react';
import { portfolioData } from '../content/portfolio';

export const Explorations: React.FC = () => {
  return (
    <section id="explorations" className="explorations-section" aria-label="Technical Explorations and Lab">
      {/* Top Divider with Section Label */}
      <div className="section-divider-header">
        <div className="divider-line" />
        <div className="section-label-badge">
          <span className="section-badge-dot" />
          <h2 className="section-badge-title">EXPLORATIONS / LAB</h2>
        </div>
      </div>

      <div className="explorations-container">
        <div className="explorations-header">
          <p className="explorations-lead">
            Experimental prototypes, rendering optimizers, and architectural tooling built to stress-test real-time browser experiences.
          </p>
        </div>

        <div className="explorations-grid">
          {portfolioData.explorations.map((item) => (
            <article key={item.id} className="exploration-card">
              <div className="exploration-card-top">
                <span className="exploration-number">{item.number}</span>
                <span className={`exploration-status status-${item.status.toLowerCase()}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {item.status}
                </span>
              </div>

              <h3 className="exploration-title">{item.title}</h3>
              <p className="exploration-summary">{item.summary}</p>

              <div className="exploration-tech-list">
                {item.tech.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

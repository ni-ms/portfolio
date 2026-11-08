import React from 'react';
import { portfolioContent } from '../content/realPortfolio';

export const ResumePage: React.FC = () => {
  const { identity, experience, education, skills, research, downloads } = portfolioContent;

  return (
    <div className="resume-page-container">
      {/* Header with Title & Download Actions */}
      <header className="resume-header">
        <div className="page-meta-eyebrow">
          <span className="eyebrow-accent">PORTFOLIO</span>
          <span className="eyebrow-sep">/</span>
          <span>RÉSUMÉ &amp; BACKGROUND</span>
        </div>

        <div className="resume-title-block">
          <h1 className="resume-person-name">{identity.name}</h1>
          <p className="resume-headline-text">{identity.headline}</p>
          <div className="resume-contact-inline">
            <span className="resume-location">{identity.location}</span>
            <span className="inline-sep" aria-hidden="true">·</span>
            <a href={`mailto:${identity.email}`} className="resume-email-link">
              {identity.email}
            </a>
          </div>
        </div>

        {/* Real Downloadable Résumé Buttons */}
        <div className="resume-download-actions" aria-label="Download Résumé">
          <a
            href={downloads.pdf.url}
            download={downloads.pdf.filename}
            className="download-btn download-btn-primary"
            aria-label={`${downloads.pdf.label} (${downloads.pdf.sizeLabel})`}
          >
            <span className="download-icon" aria-hidden="true">↓</span>
            <span className="download-text">{downloads.pdf.label}</span>
            {downloads.pdf.sizeLabel && (
              <span className="download-size">{downloads.pdf.sizeLabel}</span>
            )}
          </a>

          <a
            href={downloads.docx.url}
            download={downloads.docx.filename}
            className="download-btn download-btn-secondary"
            aria-label={`${downloads.docx.label} (${downloads.docx.sizeLabel})`}
          >
            <span className="download-icon" aria-hidden="true">↓</span>
            <span className="download-text">{downloads.docx.label}</span>
            {downloads.docx.sizeLabel && (
              <span className="download-size">{downloads.docx.sizeLabel}</span>
            )}
          </a>
        </div>
      </header>

      {/* 1. Experience Section */}
      <section className="resume-section" aria-labelledby="experience-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="experience-heading" className="section-badge-title">
              PROFESSIONAL EXPERIENCE
            </h2>
          </div>
        </div>

        <div className="experience-timeline">
          {experience.map((exp, index) => (
            <article key={index} className="experience-entry">
              <div className="experience-header-row">
                <div className="experience-role-group">
                  <h3 className="experience-role">{exp.role}</h3>
                  <div className="experience-company-line">
                    <span className="company-name">{exp.employer}</span>
                    {exp.isClientEngagement && exp.client && (
                      <span className="client-badge">
                        Client Engagement: <strong>{exp.client}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="experience-date-group">
                  <span className="experience-dates">{exp.dates}</span>
                  {exp.location && (
                    <span className="experience-location">{exp.location}</span>
                  )}
                </div>
              </div>

              <ul className="experience-bullets-list">
                {exp.points.map((pt, pIdx) => (
                  <li key={pIdx} className="experience-bullet">
                    <span className="bullet-point-mark" aria-hidden="true">■</span>
                    <span className="bullet-text">{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Education Section */}
      <section className="resume-section" aria-labelledby="education-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="education-heading" className="section-badge-title">
              EDUCATION
            </h2>
          </div>
        </div>

        <div className="education-grid">
          {education.map((edu, index) => (
            <article key={index} className="education-entry">
              <div className="education-header">
                <h3 className="education-degree">{edu.degree}</h3>
                <span className="education-year">{edu.year}</span>
              </div>
              <p className="education-school">{edu.school}</p>
              {edu.location && <p className="education-location">{edu.location}</p>}
              {edu.coursework && (
                <p className="education-coursework">
                  <span className="coursework-label">Coursework:</span> {edu.coursework}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* 3. Technical Capabilities / Grouped Skills (No giant chip wall) */}
      <section className="resume-section" aria-labelledby="skills-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="skills-heading" className="section-badge-title">
              TECHNICAL CAPABILITIES
            </h2>
          </div>
        </div>

        <div className="skills-categorized-grid">
          {skills.categories.map((group) => (
            <div key={group.category} className="skill-category-card">
              <h3 className="skill-category-title">{group.category}</h3>
              <div className="skill-tags-flow">
                {group.items.map((item) => (
                  <span key={item} className="skill-pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Research Section */}
      <section className="resume-section" aria-labelledby="research-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="research-heading" className="section-badge-title">
              RESEARCH &amp; PUBLICATIONS
            </h2>
          </div>
        </div>

        <article className="research-entry-card">
          <div className="research-status-row">
            <span className="status-badge-pill in-review">{research.status}</span>
            <span className="research-venue">{research.venue}</span>
          </div>

          <h3 className="research-paper-title">{research.fullTitle}</h3>

          <p className="research-summary-text">{research.summary}</p>
        </article>
      </section>
    </div>
  );
};

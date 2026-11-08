import React from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export const ResumePage: React.FC = () => {
  const { identity, experience, education, skills, research, downloads, projects } = portfolioContent;

  return (
    <div className="resume-page-container">
      {/* Header with Name, Photo, Headline & Download Actions */}
      <header className="resume-header">
        <div className="page-meta-eyebrow">
          <span className="eyebrow-accent">PORTFOLIO</span>
          <span className="eyebrow-sep">/</span>
          <span>RÉSUMÉ &amp; BACKGROUND</span>
        </div>

        <div className="resume-identity-row">
          <PhotoPlaceholder className="resume-photo" />
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

      {/* Two-Column Layout: Left = Experience; Right = Education, Grouped Text Skills, Research, Projects */}
      <div className="resume-content-grid">
        {/* Left Column: Professional Experience */}
        <div className="resume-col-main">
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
        </div>

        {/* Right Column: Education, Grouped Text Skills, Research, Selected Projects */}
        <div className="resume-col-side">
          {/* Education */}
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

            <div className="education-list">
              {education.map((edu, index) => (
                <article key={index} className="education-entry-compact">
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

          {/* Grouped Text Skills (Clean text list per category, NO 54 pills) */}
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

            <div className="skills-text-list">
              {skills.categories.map((group) => (
                <div key={group.category} className="skill-text-category">
                  <h3 className="skill-category-label">{group.category}</h3>
                  <p className="skill-category-items">
                    {group.items.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Research */}
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

          {/* Selected Technical Projects Links */}
          <section className="resume-section" aria-labelledby="resume-projects-heading">
            <div className="section-divider-header">
              <div className="divider-line" />
              <div className="section-label-badge">
                <span className="section-badge-dot" />
                <h2 id="resume-projects-heading" className="section-badge-title">
                  FEATURED PROJECTS
                </h2>
              </div>
            </div>

            <div className="resume-projects-list">
              {projects.map((p) => (
                <a key={p.slug} href={`/projects/${p.slug}`} className="resume-project-link-card">
                  <div className="proj-link-top">
                    <span className="proj-link-name">{p.name}</span>
                    <span className="proj-link-arrow">→</span>
                  </div>
                  <span className="proj-link-sub">{p.subtitle} · {p.stack}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

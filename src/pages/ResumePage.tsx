import { HeadingWords } from '../components/HeadingWords';
import { sitePath } from '../routing/sitePath';
import React from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export const ResumePage: React.FC = () => {
  const { identity, experience, education, skills, research, downloads, projects } = portfolioContent;

  return (
    <div className="portfolio-page portfolio-frame resume-page-container">
      {/* Header with Prominent Page Heading, Name, Photo, Headline & Download Actions */}
      <header className="portfolio-split resume-header">
        <div className="portfolio-cell resume-heading-row">
          <h1 className="page-main-heading"><HeadingWords>Résumé</HeadingWords></h1>
          <div className="resume-download-actions">
            <a href={sitePath(downloads.pdf.url)} download={downloads.pdf.filename} className="download-btn download-btn-primary">
              Download résumé ↓
            </a>
            <a href={sitePath(downloads.docx.url)} download={downloads.docx.filename} className="download-btn download-btn-secondary">
              DOCX
            </a>
          </div>
        </div>
        <div className="portfolio-cell resume-profile">
          <div className="resume-identity-row">
            <PhotoPlaceholder className="resume-photo" />
            <div className="resume-title-block">
              <h2 className="resume-person-name"><HeadingWords>{identity.name}</HeadingWords></h2>
              <p className="resume-role-sub">{identity.title}</p>
              <p className="resume-location">{identity.location}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Two-Column Layout: Left = Experience; Right = Education, Grouped Text Skills, Research, Projects */}
      <div className="portfolio-row portfolio-split resume-content-grid">
        {/* Left Column: Experience */}
        <div className="resume-col-main">
          <section className="resume-section" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="portfolio-section-heading"><HeadingWords>Experience</HeadingWords></h2>

            <div className="experience-timeline">
              {experience.map((exp, index) => (
                <article key={index} className="experience-entry">
                  <div className="experience-header-row">
                    <div className="experience-role-group">
                      <h3 className="experience-role"><HeadingWords>{exp.role}</HeadingWords></h3>
                      <div className="experience-company-line">
                        <span className="company-name">{exp.employer}</span>
                        {exp.isClientEngagement && exp.client && (
                          <span className="client-badge">
                            Client: <strong>{exp.client}</strong>
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

        {/* Right Column: Core Skills and Education */}
        <div className="resume-col-side">
          {/* Grouped Text Skills (Clean text list per category, NO 54 pills) */}
          <section className="resume-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="portfolio-section-heading"><HeadingWords>Core skills</HeadingWords></h2>

            <div className="skills-text-list">
              {skills.categories.map((group) => (
                <div key={group.category} className="skill-text-category">
                  <h3 className="skill-category-label"><HeadingWords>{group.category}</HeadingWords></h3>
                  <p className="skill-category-items">
                    {group.items.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="resume-section" aria-labelledby="education-heading">
            <h2 id="education-heading" className="portfolio-section-heading"><HeadingWords>Education</HeadingWords></h2>

            <div className="education-list">
              {education.map((edu, index) => (
                <article key={index} className="education-entry-compact">
                  <div className="education-header">
                    <h3 className="education-degree"><HeadingWords>{edu.degree}</HeadingWords></h3>
                    <span className="education-year">{edu.year}</span>
                  </div>
                  <p className="education-school">{edu.school}</p>
                </article>
              ))}
            </div>
          </section>

        </div>
      </div>
      {/* Selected Technical Projects Links */}
      <section className="portfolio-row resume-section resume-projects-section" aria-labelledby="resume-projects-heading">
        <h2 id="resume-projects-heading" className="portfolio-cell portfolio-section-heading"><HeadingWords>Selected projects</HeadingWords></h2>

        <div className="resume-projects-list">
          {projects.map((p) => (
            <a key={p.slug} href={sitePath(`/projects/${p.slug}`)} className="portfolio-cell resume-project-link-card">
              <div className="proj-link-top">
                <span className="proj-link-name">{p.name}</span>
                <span className="proj-link-arrow">→</span>
              </div>
              <span className="proj-link-sub">{p.subtitle}</span>
            </a>
          ))}
        </div>
      </section>
      {/* Research */}
      <section className="portfolio-row portfolio-cell resume-section" aria-labelledby="research-heading">
        <h2 id="research-heading" className="portfolio-section-heading"><HeadingWords>Research</HeadingWords></h2>

        <article className="research-entry-card">
          <div className="research-status-row">
            <span className="status-badge-pill in-review">{research.status}</span>
            <span className="research-venue">{research.venue}</span>
          </div>
          <h3 className="research-paper-title"><HeadingWords>{research.title}</HeadingWords></h3>
        </article>
      </section>

    </div>
  );
};

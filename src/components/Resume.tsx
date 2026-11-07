import React from 'react';
import { portfolioData } from '../content/portfolio';

export const Resume: React.FC = () => {
  const { resume, owner } = portfolioData;

  return (
    <section id="resume" className="resume-section" aria-label="Professional Experience and Résumé">
      {/* Top Divider with Section Label */}
      <div className="section-divider-header">
        <div className="divider-line" />
        <div className="section-label-badge">
          <span className="section-badge-dot" />
          <h2 className="section-badge-title">RÉSUMÉ & BACKGROUND</h2>
        </div>
      </div>

      <div className="resume-container">
        {/* Header row with Summary & Optional PDF download */}
        <div className="resume-intro-block">
          <div className="resume-intro-text">
            <p className="resume-summary">{resume.summary}</p>
            <div className="resume-meta-bar">
              <span className="resume-location-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {owner.location}
              </span>

              {owner.resumePdfUrl && (
                <a
                  href={owner.resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-pdf-link"
                >
                  DOWNLOAD FULL CV (PDF) ↗
                </a>
              )}
            </div>
          </div>

          {/* Portrait strictly confined to Resume section if provided */}
          {owner.resumePortraitUrl && (
            <div className="resume-portrait-wrapper">
              <img
                src={owner.resumePortraitUrl}
                alt={`${owner.name} profile portrait`}
                className="resume-portrait-img"
              />
            </div>
          )}
        </div>

        {/* Experience Timeline */}
        <div className="resume-subblock">
          <h3 className="resume-subblock-title">EXPERIENCE</h3>
          <div className="experience-timeline">
            {resume.experiences.map((exp, idx) => (
              <div key={idx} className="experience-item">
                <div className="experience-sidebar">
                  <span className="experience-period">{exp.period}</span>
                </div>
                <div className="experience-body">
                  <div className="experience-role-header">
                    <h4 className="experience-role">{exp.role}</h4>
                    <span className="experience-org">{exp.organization}</span>
                  </div>
                  <p className="experience-summary">{exp.summary}</p>
                  <ul className="experience-highlights">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="experience-highlight-item">
                        <span className="highlight-bullet" aria-hidden="true">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="resume-subblock">
          <h3 className="resume-subblock-title">TECHNICAL CAPABILITIES</h3>
          <div className="skills-grid">
            {resume.skills.map((skillGroup, sIdx) => (
              <div key={sIdx} className="skill-category-card">
                <h4 className="skill-category-title">{skillGroup.category}</h4>
                <div className="skill-pills">
                  {skillGroup.items.map((skill, kIdx) => (
                    <span key={kIdx} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="resume-subblock">
          <h3 className="resume-subblock-title">EDUCATION</h3>
          <div className="education-grid">
            {resume.education.map((edu, eIdx) => (
              <div key={eIdx} className="education-card">
                <div className="education-header">
                  <h4 className="education-degree">{edu.degree}</h4>
                  <span className="education-year">{edu.year}</span>
                </div>
                <p className="education-school">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

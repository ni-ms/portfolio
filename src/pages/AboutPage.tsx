import React from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export const AboutPage: React.FC = () => {
  const { identity, about, education, links } = portfolioContent;

  return (
    <div className="about-page-container">
      {/* Header */}
      <header className="about-intro-header">
        <div className="page-meta-eyebrow">
          <span className="eyebrow-accent">PORTFOLIO</span>
          <span className="eyebrow-sep">/</span>
          <span>ABOUT &amp; CONTACT</span>
        </div>

        <div className="about-identity-headline-row">
          <PhotoPlaceholder className="about-photo" />
          <div className="about-title-group">
            <h1 className="about-main-title">{identity.name}</h1>
            <p className="about-role-subtitle">{identity.title}</p>
            <p className="about-location-line">
              <span>{identity.location}</span>
              <span className="inline-sep" aria-hidden="true">·</span>
              <span>Carnegie Mellon University (M.S. in Software Engineering, Expected 2027)</span>
            </p>
          </div>
        </div>
      </header>

      {/* Narrative & Focus */}
      <section className="about-narrative-section" aria-labelledby="narrative-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="narrative-heading" className="section-badge-title">
              PROFESSIONAL BACKGROUND
            </h2>
          </div>
        </div>

        <div className="about-narrative-grid">
          <div className="narrative-prose-col">
            {about.paragraphs.map((p, idx) => (
              <p key={idx} className="about-paragraph">
                {p}
              </p>
            ))}
          </div>

          <div className="focus-areas-col">
            <div className="focus-card">
              <h3 className="focus-card-title">Core Areas of Focus</h3>
              <ul className="focus-list">
                {about.focus.map((item, idx) => (
                  <li key={idx} className="focus-list-item">
                    <span className="focus-marker" aria-hidden="true">■</span>
                    <span className="focus-name">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education Brief */}
      <section className="about-education-section" aria-labelledby="about-edu-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="about-edu-heading" className="section-badge-title">
              ACADEMIC BACKGROUND
            </h2>
          </div>
        </div>

        <div className="about-education-cards">
          {education.map((edu, idx) => (
            <div key={idx} className="about-edu-card">
              <span className="edu-year-badge">{edu.year}</span>
              <h3 className="edu-degree-title">{edu.degree}</h3>
              <p className="edu-school-name">{edu.school}</p>
              {edu.coursework && (
                <p className="edu-coursework-note">
                  <strong>Coursework:</strong> {edu.coursework}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section (with id="contact" for direct hash linking and focus) */}
      <section id="contact" className="about-contact-section" aria-labelledby="contact-heading" tabIndex={-1}>
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="contact-heading" className="section-badge-title">
              GET IN TOUCH
            </h2>
          </div>
        </div>

        <div className="contact-box">
          <p className="contact-lead-text">
            I am always open to discussing backend systems architecture, applied AI engineering, research collaborations, or software opportunities.
          </p>

          <div className="contact-details-grid">
            {/* Email */}
            <a href={links.email} className="contact-method-card">
              <span className="contact-method-label">Direct Email</span>
              <span className="contact-method-value">{identity.email}</span>
              <span className="contact-method-arrow">Send Message ↗</span>
            </a>

            {/* LinkedIn */}
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="contact-method-card">
              <span className="contact-method-label">LinkedIn</span>
              <span className="contact-method-value">linkedin.com/in/nikhilmsha</span>
              <span className="contact-method-arrow">Connect ↗</span>
            </a>

            {/* GitHub */}
            <a href={links.github} target="_blank" rel="noreferrer" className="contact-method-card">
              <span className="contact-method-label">GitHub</span>
              <span className="contact-method-value">github.com/ni-ms</span>
              <span className="contact-method-arrow">Repositories ↗</span>
            </a>

            {/* Phone & Location */}
            <div className="contact-method-card is-info-card">
              <span className="contact-method-label">Location &amp; Phone</span>
              <span className="contact-method-value">{identity.location}</span>
              {identity.phone && (
                <span className="contact-sub-value">{identity.phone}</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

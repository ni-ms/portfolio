import React from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export const AboutPage: React.FC = () => {
  const { identity, about, education, links } = portfolioContent;

  return (
    <div className="about-page-container">
      {/* 1. Prominent About Heading & Identity Row */}
      <header className="about-intro-header">
        <div className="page-meta-eyebrow">
          <span className="eyebrow-accent">PORTFOLIO</span>
          <span className="eyebrow-sep" aria-hidden="true">/</span>
          <span>ABOUT &amp; CONTACT</span>
        </div>

        <h1 className="page-main-heading">About</h1>

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

      {/* 2. Approved Two-Column Structure:
             Left Column: Narrative Prose + Education
             Right Column: Architectural Visual + Core Focus + Contact (#contact)
      */}
      <div className="about-two-col-layout">
        {/* Left Column: Background Narrative & Education */}
        <div className="about-col-left">
          <section className="about-narrative-section" aria-labelledby="narrative-heading">
            <div className="section-divider-header">
              <div className="divider-line" />
              <div className="section-label-badge">
                <span className="section-badge-dot" />
                <h2 id="narrative-heading" className="section-badge-title">BACKGROUND</h2>
              </div>
            </div>

            <div className="narrative-prose-col">
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="about-paragraph">
                  {p}
                </p>
              ))}
            </div>

            <div className="about-actions-row">
              <a href="/resume" className="cta-btn cta-btn-primary">
                VIEW FULL RÉSUMÉ ↗
              </a>
              <a href="#contact" className="cta-btn cta-btn-secondary">
                CONTACT INFORMATION ↓
              </a>
            </div>
          </section>

          {/* Education directly below narrative on the left */}
          <section className="about-education-section" aria-labelledby="about-edu-heading">
            <div className="section-divider-header">
              <div className="divider-line" />
              <div className="section-label-badge">
                <span className="section-badge-dot" />
                <h2 id="about-edu-heading" className="section-badge-title">EDUCATION</h2>
              </div>
            </div>

            <div className="about-education-cards">
              {education.map((edu, idx) => (
                <div key={idx} className="about-edu-card">
                  <div className="edu-top-row">
                    <h3 className="edu-degree-title">{edu.degree}</h3>
                    <span className="edu-year-badge">{edu.year}</span>
                  </div>
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
        </div>

        {/* Right Column: Architectural Visual + Areas of Focus + Contact */}
        <div className="about-col-right">
          <div className="about-hero-visual">
            <figure className="about-illustration-figure">
              <img
                src="/images/about/systems-architecture.svg"
                alt="Systems architecture topology diagram"
                className="about-illustration-img"
                loading="eager"
              />
              <figcaption className="about-illustration-caption">
                Architectural systems topology across backend services, retrieval pipelines, and CPU optimization.
              </figcaption>
            </figure>
          </div>

          {/* Areas of Focus directly under visual on the right */}
          <section className="about-focus-section" aria-labelledby="focus-heading">
            <div className="section-divider-header">
              <div className="divider-line" />
              <div className="section-label-badge">
                <span className="section-badge-dot" />
                <h2 id="focus-heading" className="section-badge-title">AREAS OF FOCUS</h2>
              </div>
            </div>

            <div className="focus-card">
              <ul className="focus-list">
                {about.focus.map((item, idx) => (
                  <li key={idx} className="focus-list-item">
                    <span className="focus-marker" aria-hidden="true">■</span>
                    <span className="focus-name">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Compact Contact Section (Target for #contact) */}
          <section id="contact" className="about-contact-section" aria-labelledby="contact-heading" tabIndex={-1}>
            <div className="section-divider-header">
              <div className="divider-line" />
              <div className="section-label-badge">
                <span className="section-badge-dot" />
                <h2 id="contact-heading" className="section-badge-title">CONTACT</h2>
              </div>
            </div>

            <div className="contact-box-compact">
              <p className="contact-lead-text">
                Direct channels for technical discussions, software engineering opportunities, and project inquiries.
              </p>

              <div className="contact-links-row">
                <a href={links.email} className="contact-channel-pill">
                  <span className="channel-label">Email:</span>
                  <span className="channel-val">{identity.email}</span>
                </a>
                {identity.phone && (
                  <a href={`tel:${identity.phone}`} className="contact-channel-pill">
                    <span className="channel-label">Phone:</span>
                    <span className="channel-val">{identity.phone}</span>
                  </a>
                )}
                <a href={links.linkedin} target="_blank" rel="noreferrer" className="contact-channel-pill">
                  <span className="channel-label">LinkedIn:</span>
                  <span className="channel-val">linkedin.com/in/nikhilmsha ↗</span>
                </a>
                <a href={links.github} target="_blank" rel="noreferrer" className="contact-channel-pill">
                  <span className="channel-label">GitHub:</span>
                  <span className="channel-val">github.com/ni-ms ↗</span>
                </a>
                <span className="contact-channel-pill is-static">
                  <span className="channel-label">Location:</span>
                  <span className="channel-val">{identity.location}</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

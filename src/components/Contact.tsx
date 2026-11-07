import React from 'react';
import { portfolioData } from '../content/portfolio';
import { RouteEmblem } from './RouteEmblem';

export const Contact: React.FC = () => {
  const { contact } = portfolioData;

  return (
    <section id="contact" className="contact-section" aria-label="Contact and Social Links">
      {/* Top Divider with Section Label */}
      <div className="section-divider-header">
        <div className="divider-line" />
        <div className="section-label-badge">
          <span className="section-badge-dot" />
          <h2 className="section-badge-title">CONTACT & CONNECT</h2>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-emblem-wrap">
              <RouteEmblem size={28} />
            </div>
            <h3 className="contact-headline">{contact.heading}</h3>
            <p className="contact-subhead">{contact.subhead}</p>
          </div>

          <div className="contact-main-email">
            <a
              href={`mailto:${contact.emailPlaceholder}`}
              className="email-link"
              aria-label={`Send email to ${contact.emailPlaceholder}`}
            >
              <span className="email-text">{contact.emailPlaceholder}</span>
              <span className="email-arrow">↗</span>
            </a>
          </div>

          <div className="contact-social-bar">
            <span className="social-bar-label">EXTERNAL CHANNELS:</span>
            <div className="social-links-list">
              {contact.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-channel-link"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

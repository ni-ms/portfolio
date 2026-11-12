import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export function AboutPage() {
  const { identity, about, education, links } = portfolioContent;
  const [current, previous] = education;

  return (
    <div className="portfolio-page portfolio-frame about-page-container">
      <h1 className="portfolio-cell page-main-heading">About</h1>
      <div className="portfolio-row portfolio-split about-two-col-layout">
        <div className="portfolio-cell about-col-left">
          <div className="about-identity-headline-row">
            <PhotoPlaceholder className="about-photo" />
            <div className="about-title-group">
              <h2 className="about-main-title">{identity.name}</h2>
              <p className="about-role-subtitle">{identity.title}</p>
            </div>
          </div>
          <div className="narrative-prose-col">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="about-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="about-col-right">
          <img
            src="/images/about/systems-architecture.svg"
            alt=""
            className="about-illustration-img"
          />
        </div>
      </div>
      <div className="portfolio-row portfolio-split">
        <section aria-labelledby="about-edu-heading" className="portfolio-cell about-study">
          <h2 id="about-edu-heading" className="portfolio-section-heading">Education</h2>
          <p className="about-current-degree">{current.degree}</p>
          <p>{current.school} · {current.year}</p>
          <p className="about-previous-study">Previously {previous.degree}, {previous.school} · {previous.year}</p>
        </section>
        <section className="portfolio-cell about-focus-section" aria-labelledby="focus-heading">
          <h2 id="focus-heading" className="portfolio-section-heading">Areas of focus</h2>
          <ul className="focus-list">
            {about.focus.map((item) => <li key={item} className="focus-list-item">{item}</li>)}
          </ul>
        </section>
      </div>
      <section id="contact" className="portfolio-row portfolio-cell about-contact-section" aria-labelledby="contact-heading" tabIndex={-1}>
        <h2 id="contact-heading" className="portfolio-section-heading">Get in touch</h2>
        <div className="contact-links-row">
          <a href={links.email}>{identity.email}</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="/resume">View résumé ↗</a>
        </div>
      </section>
    </div>
  );
}

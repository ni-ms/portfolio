import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';

export function AboutPage() {
  const { identity, about, education, links } = portfolioContent;
  const [current, previous] = education;

  return (
    <div className="about-page-container">
      <h1 className="page-main-heading">About</h1>
      <div className="about-two-col-layout">
        <div className="about-col-left">
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
          <section aria-labelledby="about-edu-heading" className="about-study">
            <p>Currently studying</p>
            <h2 id="about-edu-heading">{current.degree}</h2>
            <p>{current.school} · {current.year}</p>
          </section>
          <p className="about-previous-study">Previously {previous.degree}, {previous.school} · {previous.year}</p>
        </div>
        <div className="about-col-right">
          <img
            src="/images/about/systems-architecture.svg"
            alt=""
            className="about-illustration-img"
          />
          <section className="about-focus-section" aria-labelledby="focus-heading">
            <h2 id="focus-heading" className="portfolio-section-heading">Areas of focus</h2>
            <ul className="focus-list">
              {about.focus.map((item) => <li key={item} className="focus-list-item">{item}</li>)}
            </ul>
          </section>
        </div>
      </div>
      <section id="contact" className="about-contact-section" aria-labelledby="contact-heading" tabIndex={-1}>
        <h2 id="contact-heading" className="portfolio-section-heading">Get in touch</h2>
        <p className="contact-lead-text">For engineering roles or project conversations.</p>
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

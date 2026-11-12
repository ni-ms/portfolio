import { portfolioContent } from '../content/realPortfolio';

export function Footer() {
  const { links } = portfolioContent;
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <nav aria-label="Contact links">
          <a href={links.email}>Email ↗</a>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </div>
    </footer>
  );
}

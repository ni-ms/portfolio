import { portfolioContent } from '../content/realPortfolio';
export function Footer() {
  const { links } = portfolioContent;
  return <footer className="site-footer" role="contentinfo"><div className="footer-container"><p>Nearly 3 years building production software.</p><nav aria-label="Contact links"><a href={links.email}>Email ↗</a><a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></nav></div></footer>;
}

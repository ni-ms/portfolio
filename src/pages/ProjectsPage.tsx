import { portfolioContent } from '../content/realPortfolio';
import { ProjectCard } from '../components/ProjectCard';

export function ProjectsPage() {
  const { projects } = portfolioContent;
  const [featuredProject, ...supportingProjects] = projects;

  return (
    <div className="portfolio-page portfolio-frame projects-page-container">
      <header className="portfolio-cell page-intro-header">
        <h1 className="page-main-title">Projects</h1>
      </header>

      <section className="portfolio-row projects-featured-section" aria-label="Featured project">
        <ProjectCard project={featuredProject} variant="featured" />
      </section>

      <section className="portfolio-row projects-supporting-section" aria-label="Supporting projects">
        <div className="projects-supporting-grid">
          {supportingProjects.map((project) => (
            <div className="project-grid-panel" key={project.slug}>
              <ProjectCard project={project} variant="full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

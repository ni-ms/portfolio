import React, { useState, useRef } from 'react';
import { portfolioData, ProjectItem } from '../content/portfolio';
import { ProjectThumbnail } from './ProjectThumbnail';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);

  const handleOpenModal = (project: ProjectItem, e: React.MouseEvent<HTMLElement>) => {
    activeTriggerRef.current = e.currentTarget;
    setActiveProject(project);
  };

  const handleKeyDown = (project: ProjectItem, e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activeTriggerRef.current = e.currentTarget;
      setActiveProject(project);
    }
  };

  const handleCloseModal = () => {
    setActiveProject(null);
  };

  return (
    <section id="work" className="projects-section" aria-label="Selected Projects">
      {/* Top Divider with Section Label */}
      <div className="section-divider-header">
        <div className="divider-line" />
        <div className="section-label-badge">
          <span className="section-badge-dot" />
          <h2 className="section-badge-title">SELECTED PROJECTS</h2>
        </div>
      </div>

      <div className="projects-container">
        {/* Desktop 3-column layout / Mobile stacked cards */}
        <div className="projects-grid">
          {portfolioData.projects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              aria-label={`View details for ${project.number} ${project.title}`}
              onClick={(e) => handleOpenModal(project, e)}
              onKeyDown={(e) => handleKeyDown(project, e)}
            >
              <div className="project-card-header">
                <span className="project-card-number">{project.number}</span>
                <span className="project-card-slash">/</span>
                <span className="project-card-title">{project.title}</span>
                <span className="project-card-arrow" aria-hidden="true">↗</span>
              </div>

              <div className="project-card-visual">
                <ProjectThumbnail type={project.thumbnailType} />
              </div>

              <div className="project-card-content">
                <div className="project-card-meta">
                  <span className="project-category">{project.category}</span>
                  <span className="project-year">{project.year}</span>
                </div>
                <h3 className="project-subtitle">{project.subtitle}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-card-footer">
                <span className="project-open-hint">EXPAND SPECIFICATION ↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Accessible Detail Modal */}
      <ProjectModal
        project={activeProject}
        onClose={handleCloseModal}
        triggerRef={activeTriggerRef}
      />
    </section>
  );
};

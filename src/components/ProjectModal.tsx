import React, { useRef } from 'react';
import { ProjectItem } from '../content/portfolio';
import { ProjectThumbnail } from './ProjectThumbnail';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, {
    isActive: Boolean(project),
    onClose,
    returnFocusRef: triggerRef,
  });

  if (!project) return null;

  return (
    <div
      className="project-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="project-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        aria-describedby="modal-project-desc"
        tabIndex={-1}
      >
        <div className="project-modal-header">
          <div className="modal-header-meta">
            <span className="modal-project-number">{project.number}</span>
            <span className="modal-meta-separator">/</span>
            <span className="modal-project-category">{project.category}</span>
            <span className="modal-meta-separator">·</span>
            <span className="modal-project-year">{project.year}</span>
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close project details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="project-modal-body">
          <div className="modal-preview-graphic">
            <ProjectThumbnail type={project.thumbnailType} />
          </div>

          <div className="modal-title-group">
            <h2 id="modal-project-title" className="modal-title">
              {project.title}
            </h2>
            <p className="modal-subtitle">{project.subtitle}</p>
          </div>

          <p id="modal-project-desc" className="modal-overview-text">
            {project.description}
          </p>

          <div className="modal-detail-sections">
            <div className="modal-detail-block">
              <h3 className="modal-detail-heading">
                <span className="detail-tag">01</span> THE CHALLENGE
              </h3>
              <p className="modal-detail-content">{project.details.challenge}</p>
            </div>

            <div className="modal-detail-block">
              <h3 className="modal-detail-heading">
                <span className="detail-tag">02</span> OUR APPROACH
              </h3>
              <p className="modal-detail-content">{project.details.approach}</p>
            </div>

            <div className="modal-detail-block">
              <h3 className="modal-detail-heading">
                <span className="detail-tag">03</span> KEY OUTCOME
              </h3>
              <p className="modal-detail-content">{project.details.outcome}</p>
            </div>
          </div>

          <div className="modal-tags-container">
            <h4 className="modal-tags-label">SYSTEMS & ARCHITECTURE</h4>
            <div className="modal-tags-list">
              {project.tags.map((tag) => (
                <span key={tag} className="modal-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-modal-footer">
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-action-cta"
            >
              VISIT PROJECT SITE ↗
            </a>
          ) : (
            <span className="modal-action-note">INTERACTIVE DEMO SPECIFICATION</span>
          )}
          <button
            type="button"
            className="modal-dismiss-btn"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PortfolioProject } from '../content/realPortfolio';
import { ProjectDetailTemplate } from '../components/ProjectDetailTemplate';

interface ProjectDetailPageProps {
  project: PortfolioProject;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  return (
    <div className="project-detail-page-container">
      <ProjectDetailTemplate project={project} />
    </div>
  );
};

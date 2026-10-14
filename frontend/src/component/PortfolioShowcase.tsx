import React from 'react';
import './PortfolioShowcase.css';

interface ProjectItem {
  id: string;
  videoUrl: string;
}

const projects: ProjectItem[] = [
  {
    id: '1',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/usecase-2.mp4',
  },
  {
    id: '2',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/usecase-1.mp4',
  },
  {
    id: '3',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/usecase-3.mp4',
  },
];

export const PortfolioShowcase: React.FC = () => {
  return (
    <section className="portfolio-section">
      <div className="portfolio-container">
        {/* Section Header */}
        <div className="portfolio-header">
          <h2 className="portfolio-title">
            Where ideas become production-ready experiences
          </h2>
          <p className="portfolio-subtitle">
            Supercharge your team to deliver production-ready interactive 2D & 3D experiences.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {projects.map((project) => (
            <div key={project.id} className="portfolio-card">
              <div className="card-media-wrapper">
                <video
                  src={project.videoUrl}
                  className="card-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
import React from 'react';
import './FeatureShowcase.css';

interface FeatureShowcaseProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  videoUrl?: string;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  badgeText = '3D Design',
  title = 'Collaborative 3D Design, ready for production',
  subtitle = 'A web-based, collaborative 3D design platform to create production-ready interactive real-time 3D experiences.',
  buttonText = 'Learn more →',
  buttonLink = '#',
  videoUrl = 'https://cdn.spline.design/_assets/_videos/spline_3d_editor.mp4', // يمكنك استبدال الرابط بملف الفيديو الخاص بك
}) => {
  return (
    <section className="feature-section">
      <div className="feature-container">
        {/* Top Tag / Badge */}
        <div className="feature-badge">
          <span>{badgeText}</span>
        </div>

        {/* Main Heading & Subtitle */}
        <h1 className="feature-title">{title}</h1>
        <p className="feature-subtitle">{subtitle}</p>

        {/* Action Button */}
        <a href={buttonLink} className="feature-button">
          {buttonText}
        </a>

        {/* Media / Video Container */}
        <div className="feature-media-wrapper">
          <video
            src={videoUrl}
            className="feature-video"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
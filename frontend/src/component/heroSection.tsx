import React from 'react';
import './heroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-container">
      {/* Background Video */}
      <video 
        className="hero-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="https://fluxgo-3d-app.web.app/background.mp4" type="video/mp4" />
      </video>

      {/* Subtle Overlay */}
      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* Main Heading */}
        <h1 className="hero-title">
          The all-in-one platform <br />
          for 3D and design
        </h1>

        {/* Subtitle / Description */}
        <p className="hero-description">
          Spline is a design platform to create and collaborate on interactive 
          production-ready experiences in real-time.
        </p>

        {/* Call to Action Button */}
        <div className="hero-actions">
          <a href="#get-started" className="btn-get-started-blue">
            Get started — it's free &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
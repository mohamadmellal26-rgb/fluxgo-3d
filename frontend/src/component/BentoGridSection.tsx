import React from 'react';
import './BentoGridSection.css';

interface BentoItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: '1',
    title: 'Real-time rendering',
    description: 'Experience changes instantly.',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/bento-design.mp4',
  },
  {
    id: '2',
    title: '3D Modeling',
    description: 'Advanced tools for creators.',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/bento-materials.mp4',
  },
  {
    id: '3',
    title: 'Multi-platform',
    description: 'Export anywhere you need.',
    videoUrl: 'https://cdn.spline.design/_assets/_videos/bento-data.mp4',
  },
  {
    id: '4',
    title: 'Cloud Sync',
    description: 'Keep your work synced live.',
    videoUrl: '', // يمكنك استبداله بفيديو أو إبقاؤه
  },
];

export const BentoGridSection: React.FC = () => {
  return (
    <section className="bento-section">
      <div className="bento-container">
        <div className="bento-grid">
          {bentoItems.map((item) => (
            <div key={item.id} className="bento-card">
              <div className="bento-media-wrapper">
                {item.videoUrl && (
                  <video
                    src={item.videoUrl}
                    className="bento-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}
                {/* طبقة تدرج لوني لتحسين قراءة النص فوق الفيديو */}
                <div className="bento-overlay" />
                
                {/* النص أصبح الآن عائماً داخل الفيديو */}
                <div className="bento-content">
                  <h3 className="bento-title">{item.title}</h3>
                  <p className="bento-desc">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
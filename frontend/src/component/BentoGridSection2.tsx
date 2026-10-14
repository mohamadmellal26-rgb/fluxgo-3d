import React from 'react';
import './BentoGridSection2.css';

interface BentoItem {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string; // تم توحيد الرابط ليدعم الصور والفيديوهات
  spanClass?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: '1',
    title: 'Real-time rendering',
    description: 'Experience changes instantly.',
    mediaUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/cf8f60115709925.605377385d900.png', // رابط صورة
  },
  {
    id: '2',
    title: '3D Modeling',
    description: 'Advanced tools for creators.',
    mediaUrl: 'https://cdn.spline.design/_assets/_videos/usecase-4.mp4', // رابط فيديو
  },
  {
    id: '3',
    title: 'Multi-platform',
    description: 'Export anywhere you need.',
    mediaUrl: 'https://cdn.spline.design/_assets/_videos/usecase-5.mp4', // رابط فيديو
  },
  {
    id: '4',
    title: 'Cloud Sync',
    description: 'Keep your work synced live.',
    mediaUrl: 'https://cdn.spline.design/_assets/_videos/usecase-7.mp4', // رابط فيديو
  },
];

export const BentoGridSection2: React.FC = () => {
  // دالة لمعرفة ما إذا كان الرابط صورة أو فيديو بناءً على الامتداد
  const isImage = (url: string) => {
    return /\.(png|jpg|jpeg|webp|gif)$/i.test(url);
  };

  return (
    <section className="bento-section">
      <div className="bento-container">
        <div className="bento-grid">
          {bentoItems.map((item) => (
            <div key={item.id} className="bento-card">
              {/* Media Container (يعرض صورة أو فيديو تلقائياً حسب الرابط) */}
              <div className="bento-media-wrapper">
                {item.mediaUrl && (
                  isImage(item.mediaUrl) ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="bento-image"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="bento-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  )
                )}
              </div>
              
              {/* Text Content */}
              <div className="bento-content">
                <h3 className="bento-title">{item.title}</h3>
                <p className="bento-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection2;
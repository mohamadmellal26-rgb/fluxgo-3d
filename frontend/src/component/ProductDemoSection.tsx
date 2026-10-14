import React from 'react';
import './ProductDemoSection.css';

interface ProductDemoProps {
  title?: string;
  subtitle?: string;
  mediaUrl?: string; // يمكن أن يكون فيديو أو صورة لسطح المكتب/المنتج
}

export const ProductDemoSection: React.FC<ProductDemoProps> = ({
  title = "Create and collaborate in real-time",
  subtitle = "Add comments, invite your team, or share a link! Brainstorming in 3D is easy with Spline.",
  mediaUrl = "https://cdn.spline.design/_assets/_videos/features/comments.mp4",
}) => {
  const isImage = (url: string) => /\.(png|jpg|jpeg|webp|gif)$/i.test(url);

  return (
    <section className="demo-section">
      <div className="demo-container">
        {/* Header Content */}
        <div className="demo-header">
          <h2 className="demo-title">{title}</h2>
          <p className="demo-subtitle">{subtitle}</p>
        </div>

        {/* App Window Frame Wrapper */}
        <div className="demo-frame-wrapper">
          <div className="demo-frame">
            {isImage(mediaUrl) ? (
              <img
                src={mediaUrl}
                alt="Product Demo Interface"
                className="demo-media"
                loading="lazy"
              />
            ) : (
              <video
                src={mediaUrl}
                className="demo-media"
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoSection;
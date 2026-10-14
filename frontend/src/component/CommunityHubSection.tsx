import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import './CommunityHubSection.css';

interface QuickLink {
  id: string;
  title: string;
  description: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  {
    id: '1',
    title: 'Library',
    description: 'Explore library files.',
    href: '#',
  },
  {
    id: '2',
    title: 'Academy',
    description: 'Learn with video guides.',
    href: '#',
  },
  {
    id: '3',
    title: 'Docs',
    description: 'Learn with written docs.',
    href: '#',
  },
  {
    id: '4',
    title: 'Download',
    description: 'Download Spline apps.',
    href: '#',
  },
];

// 6 بطاقات للمجتمع (يمكن استخدام صور/معاينات داخلها)
const communityCards = Array.from({ length: 6 }, (_, index) => ({
  id: `card-${index + 1}`,
  title: `Community Design ${index + 1}`,
  imageUrl: '', // ضع رابط الصورة هنا عند الحاجة
}));

export const CommunityHubSection: React.FC = () => {
  return (
    <section className="community-section">
      <div className="community-container">
        
        {/* Main Grid Header & Cards Showcase */}
        <div className="community-main-grid">
          
          {/* Left Column: Info & CTA */}
          <div className="community-info">
            <div className="community-icon-wrapper">
              <Users size={24} className="community-icon" />
            </div>
            
            <h2 className="community-title">Community Platform</h2>
            <p className="community-desc">
              Explore and remix designs made by other community members.
            </p>
            
            <button className="community-btn">
              Explore Community
            </button>
          </div>

          {/* Right Column: 6 Cards Grid (3x2) */}
          <div className="community-cards-grid">
            {communityCards.map((card) => (
              <div key={card.id} className="community-card">
                <div className="community-card-preview">
                  {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.title} />
                  ) : (
                    <div className="community-card-placeholder" />
                  )}
                </div>
                <div className="community-card-bar" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Quick Resource Links (4 Cards) */}
        <div className="community-links-grid">
          {quickLinks.map((link) => (
            <a key={link.id} href={link.href} className="resource-card">
              <div className="resource-header">
                <span className="resource-title">{link.title}</span>
                <ChevronRight size={16} className="resource-arrow" />
              </div>
              <p className="resource-desc">{link.description}</p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CommunityHubSection;
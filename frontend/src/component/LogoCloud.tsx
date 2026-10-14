import React from 'react';
import './LogoCloud.css';

interface LogoItem {
  id: string;
  name: string;
  imageUrl: string;
}

const organizations: LogoItem[] = [
  { 
    id: '1', 
    name: 'Google', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' 
  },
  { 
    id: '2', 
    name: 'Shopify', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Shopify_logo.svg' 
  },
  { 
    id: '3', 
    name: 'GIPHY', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Giphy-logo.svg' 
  },
  { 
    id: '4', 
    name: 'Webflow', 
    imageUrl: 'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/webflow.svg' 
  },
  { 
    id: '5', 
    name: 'Meta', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' 
  },
];

export const LogoCloud: React.FC = () => {
  return (
    <section className="logo-cloud-section">
      <div className="logo-cloud-container">
        <p className="logo-cloud-subtitle">
          Empowering individuals and teams at world's leading organizations
        </p>
        
        <div className="logos-grid">
          {organizations.map((org) => (
            <div key={org.id} className="logo-card">
              <img src={org.imageUrl} alt={org.name} className="logo-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
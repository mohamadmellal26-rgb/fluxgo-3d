import React from 'react';
import './ShowcaseGrid.css';

interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  link?: string;
}

const row1Items: ShowcaseItem[] = [
  { id: '1', title: 'Futuristic UI', author: '@tech_guru', imageUrl: 'https://www.easeout.co/images/uploads/redshift.jpg' },
  { id: '2', title: 'Glassmorphism Art', author: '@glass_artist', imageUrl: 'https://i.pinimg.com/originals/ce/aa/23/ceaa233fc66d06fc568e8a00355b920f.png' },
  { id: '3', title: 'Character Design', author: '@toon_master', imageUrl: 'https://www.easeout.co/images/uploads/domo.png' },
  { id: '4', title: 'Dynamic Typography', author: '@type_king', imageUrl: 'https://www.easeout.co/images/uploads/crafting-status.png' },
  { id: '5', title: 'Product Showcase', author: '@studio_pro', imageUrl: 'https://i.pinimg.com/736x/ca/6e/46/ca6e46de97b719ae4e7a11d0fc216149.jpg' },
  { id: '6', title: '3D Logos', author: '@samborek', imageUrl: 'https://cdn.dribbble.com/userupload/9918798/file/original-70a4b8965d590e3decde2d456f551504.png?resize=1600x1200' },
];

const row2Items: ShowcaseItem[] = [
  { id: '7', title: 'Claymorphism Elements', author: '@clay_studio', imageUrl: 'https://cdn.dribbble.com/userupload/2578780/file/still-e3e5dc6d2af2bb5dd6af9f4922cb8ce0.png?resize=640x480&vertical=center' },
  { id: '8', title: 'Vaporwave Aesthetic', author: '@retro_wave', imageUrl: 'https://cdn.dribbble.com/users/1841918/screenshots/20051233/media/060fd37d5884b4d3b1356d63286e7db3.png?resize=1200x900&vertical=center' },
  { id: '9', title: 'Abstract Portraits', author: '@face_art', imageUrl: 'https://cdn.dribbble.com/users/2816498/screenshots/20064481/media/85edd6546056d9d93a8bf457d268c16b.png?resize=400x0' },
  { id: '10', title: 'Nature Integration', author: '@eco_design', imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/b5e9d7136724907.61feaa66b583f.jpg' },
  { id: '11', title: 'Interactive Widgets', author: '@web_dev', imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/728176187990661.6594f1e23beac.png' },
  { id: '12', title: 'Surreal Landscapes', author: '@dream_world', imageUrl: 'https://cdn.dribbble.com/users/9136742/screenshots/16449255/website_design_and_banner_design_html__css___bootstrap.png' },
];

export const ShowcaseGrid: React.FC = () => {
  return (
    <section className="showcase-section">
      <div className="showcase-header">
        <h2 className="showcase-title">
          <span className="title-muted">A complete platform for </span>
          <span className="title-bold">real-time</span>
          <br />
          <span className="title-bold">interactive design</span>
        </h2>
        <p className="showcase-subtitle">
          Get started by remixing a 3D design made by the Spline community.
        </p>
      </div>

      {/* Rows Container */}
      <div className="rows-wrapper">
        {/* Row 1: Moves Left */}
        <div className="marquee-row row-left">
          <div className="marquee-track">
            {[...row1Items, ...row1Items].map((item, index) => (
              <a key={`${item.id}-${index}`} href={item.link || '#'} className="showcase-card">
                <div className="card-image-wrapper">
                  <img src={item.imageUrl} alt={item.title} className="card-image" loading="lazy" />
                </div>
                <div className="card-info">
                  <span className="author-avatar-placeholder"></span>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <span className="card-author">{item.author}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Moves Right */}
        <div className="marquee-row row-right">
          <div className="marquee-track">
            {[...row2Items, ...row2Items].map((item, index) => (
              <a key={`${item.id}-${index}`} href={item.link || '#'} className="showcase-card">
                <div className="card-image-wrapper">
                  <img src={item.imageUrl} alt={item.title} className="card-image" loading="lazy" />
                </div>
                <div className="card-info">
                  <span className="author-avatar-placeholder"></span>
                  <div className="card-text">
                    <h5 className="card-title">{item.title}</h5>
                    <span className="card-author">{item.author}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseGrid;
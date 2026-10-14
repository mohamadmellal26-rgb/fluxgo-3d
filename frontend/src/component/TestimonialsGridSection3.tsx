import React from 'react';
import './TestimonialsGridSection3.css';

interface TestimonialCard {
  id: string;
  companyName: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
}

const testimonialsData: TestimonialCard[] = [
  {
    id: '1',
    companyName: 'OSCILAR',
    quote: '"I wanted to do something really cool with 3D, really bring our brand to life, and Spline was the only tool that would let me do that."',
    authorName: 'Andrew Pons',
    authorRole: 'Principal Brand Designer',
    avatarUrl: 'https://img.magnific.com/premium-photo/passport-photo-man-portrait-smiling-caucasian-businessman-suit-tie_817921-61144.jpg?w=2000',
  },
  {
    id: '2',
    companyName: 'Resend',
    quote: '"Before Spline, we would need a developer just to handle the 3D integration. Now designers can focus on crafting assets, and engineers don\'t have to rebuild them from scratch."',
    authorName: 'Zeh Fernandes',
    authorRole: 'Founding Designer',
    avatarUrl: 'https://res.cloudinary.com/globes/image/upload/t_desktop_article_content_header_800*392,f_auto/v1661673892/direct/TomOrbach_1_gduv27.png',
  },
  {
    id: '3',
    companyName: 'KOJI',
    quote: '"Spline is very easy and fast to learn. The learning curve is low, even junior designers can step in and integrate 3D experiences into a Webflow project."',
    authorName: 'Pavel Dergachev',
    authorRole: 'Founder & Creative Director',
    avatarUrl: 'https://i1.sndcdn.com/avatars-000058974277-iy94ss-t500x500.jpg',
  },
];

export const TestimonialsGridSection3: React.FC = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Header Title */}
        <div className="testimonials-header">
          <h2 className="testimonials-main-title">
            Loved by innovative teams <br />
            <span className="testimonials-subtitle-colored">around the world</span>
          </h2>
        </div>

        {/* Grid Cards */}
        <div className="testimonials-grid">
          {testimonialsData.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="testimonial-company">{item.companyName}</div>
              <p className="testimonial-text">{item.quote}</p>
              
              <div className="testimonial-author">
                <img
                  src={item.avatarUrl}
                  alt={item.authorName}
                  className="author-avatar"
                  loading="lazy"
                />
                <div className="author-info">
                  <span className="author-name">{item.authorName}</span>
                  <span className="author-role">{item.authorRole}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGridSection3;
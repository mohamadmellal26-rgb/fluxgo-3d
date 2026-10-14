import React from 'react';
import './TestimonialSection.css';

interface TestimonialProps {
  companyName: string;
  quoteParts: { text: string; highlighted?: boolean }[];
  authorName: string;
  authorRole: string;
  avatarUrl: string;
}

const testimonialData: TestimonialProps = {
  companyName: 'OSCILAR',
  quoteParts: [
    { text: '"We wanted to ' },
    { text: 'appeal to an enterprise audience.', highlighted: false },
    { text: " That's where Spline comes in. It helps our brand feel " },
    { text: 'more cutting-edge', highlighted: false },
    { text: ' than our competition."' },
  ],
  authorName: 'Andrew Pons',
  authorRole: 'Principal Brand Designer',
  avatarUrl: 'https://fluxgo-3d-app.web.app/andrew-oscilar.webp',
};

// جعل الكلمات البارزة بالأبيض
const formattedParts = [
  { text: '"We wanted to ', highlighted: true },
  { text: 'appeal to an enterprise audience. ', highlighted: false },
  { text: "That's where Spline comes in. It helps our brand feel ", highlighted: true },
  { text: 'more cutting-edge ', highlighted: false },
  { text: 'than our competition."', highlighted: true },
];

export const TestimonialSection: React.FC = () => {
  const { companyName, authorName, authorRole, avatarUrl } = testimonialData;

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        {/* Company Identifier */}
        <div className="testimonial-brand">{companyName}</div>

        {/* Main Quote */}
        <blockquote className="testimonial-quote">
          {formattedParts.map((part, index) => (
            <span
              key={index}
              className={part.highlighted ? 'highlighted-text' : 'muted-text'}
            >
              {part.text}
            </span>
          ))}
        </blockquote>

        {/* Author Details */}
        <div className="testimonial-author">
          <img
            src={avatarUrl}
            alt={authorName}
            className="author-avatar"
            loading="lazy"
          />
          <div className="author-info">
            <span className="author-name">{authorName}</span>
            <span className="author-role">, {authorRole}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
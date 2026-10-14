import React from 'react';
import './TestimonialSection2.css';

interface Testimonial2Props {
  companyLogo?: string;
  quoteParts: { text: string; highlighted?: boolean }[];
  authorName: string;
  authorRole: string;
  companyName: string;
  avatarUrl: string;
}

const testimonialData: Testimonial2Props = {
  companyName: 'Resend',
  quoteParts: [
    { text: '"We wanted to ' },
    { text: 'appeal to an enterprise audience', highlighted: true },
    { text: ". That's where Spline comes in. It helps our brand feel " },
    { text: 'more cutting-edge', highlighted: true },
    { text: ' than our competition."' },
  ],
  authorName: 'Andrew Pons',
  authorRole: 'Principal Brand Designer',
  avatarUrl: 'https://media.istockphoto.com/id/1151785606/photo/portrait-of-a-handsome-chinese-businessman.jpg?s=170667a&w=0&k=20&c=-xoyo4BIWl_BFfVlEOxF_I2qOaDrjajDUtw5GL-JgRw=',
};

export const TestimonialSection2: React.FC = () => {
  const { companyName, quoteParts, authorName, authorRole, avatarUrl } = testimonialData;

  return (
    <section className="testimonial-section-2">
      <div className="testimonial-card-2">
        {/* Company Header */}
        <div className="testimonial-brand-2">{companyName}</div>

        {/* Main Quote */}
        <blockquote className="testimonial-quote-2">
          {quoteParts.map((part, index) => (
            <span
              key={index}
              className={part.highlighted ? 'highlight-white' : 'highlight-gray'}
            >
              {part.text}
            </span>
          ))}
        </blockquote>

        {/* Author Footer */}
        <div className="testimonial-author-2">
          <img
            src={avatarUrl}
            alt={authorName}
            className="author-avatar-2"
            loading="lazy"
          />
          <div className="author-details-2">
            <span className="author-name-2">{authorName}</span>
            <span className="author-separator">, </span>
            <span className="author-role-2">{authorRole}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection2;
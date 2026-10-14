import React from 'react';

export const FinalCallToActionFooter: React.FC = () => {
  return (
    <>
      <style>{`
        /* Container Section */
        .cta-footer-section {
          width: 100%;
          padding: 80px 24px 60px 24px;
          background-color: #000000;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
        }

        .cta-footer-container {
          width: 100%;
          max-width: 1280px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Top Call to Action Box */
        .cta-box {
          text-align: center;
          margin-bottom: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .cta-title {
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0;
        }

        .cta-desc {
          font-size: clamp(15px, 1.8vw, 18px);
          font-weight: 400;
          color: #8e8e93;
          margin: 0 0 16px 0;
          max-width: 600px;
          line-height: 1.5;
        }

        .cta-button {
          background-color: #007aff;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          background-color: #0062cc;
          transform: translateY(-2px);
        }

        /* Bottom Footer Navigation Columns */
        .footer-columns {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr) 1.2fr;
          gap: 40px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00c6ff, #0072ff, #7f00ff);
        }

        .footer-col-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .footer-link {
          font-size: 14px;
          font-weight: 400;
          color: #8e8e93;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .footer-columns {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
        }

        @media (max-width: 600px) {
          .footer-columns {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .cta-footer-section {
            padding: 60px 16px 40px 16px;
          }
        }
      `}</style>

      <footer className="cta-footer-section">
        <div className="cta-footer-container">
          
          {/* Top CTA Area */}
          <div className="cta-box">
            <h2 className="cta-title">Design. Collaborate. Ship.</h2>
            <p className="cta-desc">
              Superpower your team to deliver production-ready interactive 2D and 3D experiences all in one platform.
            </p>
            <a href="#get-started" className="cta-button">
              Get started — it's free →
            </a>
          </div>

          {/* Bottom Footer Links Grid */}
          <div className="footer-columns">
            
            {/* Logo Column */}
            <div className="footer-logo-col">
              <div className="footer-logo-circle" />
            </div>

            {/* Products Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Products</h4>
              <a href="#" className="footer-link">3D Design</a>
              <a href="#" className="footer-link">Hana</a>
              <a href="#" className="footer-link">iOS</a>
              <a href="#" className="footer-link">Android</a>
              <a href="#" className="footer-link">Spline Mirror</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>

            {/* Resources Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <a href="#" className="footer-link">Contra</a>
              <a href="#" className="footer-link">Affiliate</a>
              <a href="#" className="footer-link">Hana Challenge</a>
              <a href="#" className="footer-link">Education</a>
              <a href="#" className="footer-link">Enterprise</a>
              <a href="#" className="footer-link">Solutions</a>
            </div>

            {/* Company Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Terms & Conditions</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Security</a>
            </div>

            {/* Contact Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contact</h4>
              <a href="mailto:help@spline.design" className="footer-link">help@spline.design</a>
              <a href="mailto:jobs@spline.design" className="footer-link">jobs@spline.design</a>
            </div>

          </div>

        </div>
      </footer>
    </>
  );
};

export default FinalCallToActionFooter;
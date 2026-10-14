import React, { useState, useEffect } from 'react';
import './1.header.css';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // التحقق من وجود التوكن لتحديد حالة التسجيل
    const token = localStorage.getItem('user_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="header-container">
      <nav className="header-nav">
        {/* Logo */}
        <a href="/" className="logo-link" aria-label="Home">
          <div className="logo-gradient"></div>
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          {/* Products Dropdown */}
          <li className="nav-item">
            <button className="nav-link dropdown-btn">
              Products <span className="arrow-icon">▼</span>
            </button>
            <div className="dropdown-menu">
              <a href="#product-1" className="dropdown-item">Product Feature 1</a>
              <a href="#product-2" className="dropdown-item">Product Feature 2</a>
              <a href="#product-3" className="dropdown-item">3D Studio Engine</a>
            </div>
          </li>

          {/* Resources Dropdown */}
          <li className="nav-item">
            <button className="nav-link dropdown-btn">
              Resources <span className="arrow-icon">▼</span>
            </button>
            <div className="dropdown-menu">
              <a href="#docs" className="dropdown-item">Documentation</a>
              <a href="#tutorials" className="dropdown-item">Tutorials</a>
              <a href="#blog" className="dropdown-item">Blog</a>
            </div>
          </li>

          {/* Community Dropdown */}
          <li className="nav-item">
            <button className="nav-link dropdown-btn">
              Community <span className="arrow-icon">▼</span>
            </button>
            <div className="dropdown-menu">
              <a href="#discord" className="dropdown-item">Discord Server</a>
              <a href="#forum" className="dropdown-item">Community Forum</a>
              <a href="#events" className="dropdown-item">Events</a>
            </div>
          </li>

          {/* Regular Links */}
          <li className="nav-item">
            <a href="#customers" className="nav-link">Customers</a>
          </li>
          <li className="nav-item">
            <a href="#enterprise" className="nav-link">Enterprise</a>
          </li>
          <li className="nav-item">
            <a href="#pricing" className="nav-link">Pricing</a>
          </li>
        </ul>

        {/* Action Buttons (تظهر وتختفِ بناءً على حالة تسجيل الدخول) */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              {/* زر الخروج بتصميم مخصص ومتناسق (Log Out) */}
              <button onClick={handleLogout} className="btn-logout">
                <svg 
                  className="logout-icon" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log Out</span>
              </button>

              {/* زر الانتقال للوحة التحكم */}
              <a href="/dashboard" className="btn-get-started">
                Get Started
              </a>
            </>
          ) : (
            <>
              {/* زر تسجيل الدخول إذا لم يكن مسجلاً */}
              <a href="/auth" className="btn-login">
                <svg 
                  className="login-icon" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Log In</span>
              </a>

              <a href="/dashboard" className="btn-get-started">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
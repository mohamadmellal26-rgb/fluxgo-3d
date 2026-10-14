import React, { useState } from 'react';
import './Auth.css';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin 
        ? 'https://fluxgo-3d.onrender.com/api/login' 
        : 'https://fluxgo-3d.onrender.com/api/register';

      // إرسال البيانات بالتنسيق الصحيح المتوافق مع سيرفر الـ Go
      const requestBody: any = {
        email: identifier,
        password: password,
      };

      if (!isLogin) {
        requestBody.fullName = identifier; // أو اسم افتراضي إذا رغبت
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || 'حدث خطأ أثناء الاتصال بالسيرفر');
      }

      // حفظ التوكن وبيانات المستخدم في التخزين المحلي
      localStorage.setItem('user_token', data.token);
      if (data.user) {
        localStorage.setItem('user_data', JSON.stringify(data.user));
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'تعذر الاتصال بالسيرفر، تأكد من البيانات المدخلة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      
      {/* القسم الأيسر: نموذج تسجيل الدخول */}
      <div className="auth-left-section">
        <div className="auth-form-wrapper">
          
          <div className="auth-header">
            <div className="auth-gradient-logo" />
            <h1 className="auth-title">Welcome to FluxGO 3D</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Log in with your email.' : 'Create an account with your email.'}
            </p>
          </div>

          {/* زر تسجيل الدخول عبر جوجل */}
          <button type="button" className="google-auth-btn">
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.36 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.83 0 12s.43 3.88 1.18 5.4l4.09-3.16z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span>Log in with Google</span>
          </button>

          {error && <div className="auth-error-message">{error}</div>}

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-field-group">
              <input 
                type="text" 
                placeholder="mohamad-mellal or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="auth-custom-input"
              />
            </div>

            <div className="input-field-group">
              <input 
                type="password" 
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-custom-input"
              />
            </div>

            <button type="submit" className="auth-continue-btn" disabled={loading}>
              {loading ? 'جاري المعالجة...' : 'Continue'}
            </button>
          </form>

          {/* التبديل */}
          <div className="auth-footer-text">
            <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <button 
              type="button" 
              className="toggle-auth-link"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? 'Create Account' : 'Log in'}
            </button>
          </div>

          <div className="auth-terms-footer">
            FluxGO 3D uses Google reCAPTCHA for secure authentication. <br />
            <a href="#privacy">Privacy</a> <a href="#terms">Terms</a>
          </div>

        </div>
      </div>

      {/* القسم الأيمن: معرض العرض */}
      <div className="auth-right-section">
        <div className="showcase-columns-container">
          
          <div className="showcase-column left-col">
            <div className="showcase-card">
              <div className="card-mockup-wrapper">
                <img 
                  src="https://cdn.dribbble.com/userupload/44053999/file/original-0266ea50ab207a369aeb06d7074562a5.png" 
                  alt="Product Design" 
                  className="card-media"
                />
              </div>
              <span className="showcase-label">Product Design</span>
            </div>

            <div className="showcase-card">
              <div className="card-mockup-wrapper">
                <video 
                  src="https://cdn.dribbble.com/userupload/2578781/file/original-082992a3e84f85a175da9becee89f9ef.mp4" 
                  className="card-media"
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              </div>
              <span className="showcase-label">Interactive Websites</span>
            </div>
          </div>

          <div className="showcase-column right-col">
            <div className="showcase-card tall-card">
              <div className="card-mockup-wrapper tall-wrapper"></div>
              <span className="showcase-label">Animated Characters</span>
            </div>
          </div>

        </div>

        <div className="trusted-footer">
          <p>Trusted by teams at world's leading organizations</p>
          <div className="trusted-logos">
            <span className="logo-text">GIPHY</span>
            <span className="logo-text">webflow</span>
            <span className="logo-text">Alloy</span>
          </div>
        </div>
      </div>

    </div>
  );
}
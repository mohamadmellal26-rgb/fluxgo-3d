import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Home from './home';
import Discover from './Discover';
import './Dashboard.css';

interface DashboardProps {
  // حالة المستخدم أو التوكن أو دالة للتوجيه لصفحة Login / Register
  isAuthenticated?: boolean; 
  onNavigateToAuth?: () => void; 
}

export default function Dashboard({ isAuthenticated, onNavigateToAuth }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // التحقق من وجود الجلسة أو الحساب عبر localStorage أو حالة المصادقة
    const token = localStorage.getItem('user_token');
    
    if (!token && !isAuthenticated) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [isAuthenticated]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحقق من الحساب...</div>;
  }

  // إذا لم يكن مسجلاً، منع الوصول وإظهار شاشة التوجيه
  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        <h2>عذراً، يجب تسجيل الدخول أولاً</h2>
        <p>لا يمكنك الوصول إلى هذه الصفحة إلا بعد إنشاء حساب أو تسجيل الدخول.</p>
        <button 
          onClick={() => {
            if (onNavigateToAuth) {
              onNavigateToAuth();
            } else {
              window.location.reload();
            }
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '1rem'
          }}
        >
          إنشاء حساب / تسجيل الدخول
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'discover':
        return <Discover />;
      case 'my-files':
        return <div style={{ padding: '2rem' }}><h2>My Files</h2><p>قريباً...</p></div>;
      case 'templates':
        return <div style={{ padding: '2rem' }}><h2>Templates</h2><p>قريباً...</p></div>;
      case 'generate':
        return <div style={{ padding: '2rem' }}><h2>Generate</h2><p>قريباً...</p></div>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* تمرير حالة التبويب النشط والدالة المسؤولة عن تغييره */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* منطقة المحتوى الديناميكية */}
      <main className="dashboard-main-content">
        {renderContent()}
      </main>
    </div>
  );
}
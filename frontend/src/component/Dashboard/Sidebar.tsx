import { useState, useEffect } from 'react';
import { 
  Home, 
  Compass, 
  FileText, 
  LayoutGrid, 
  Sparkles, 
  Zap, 
  Trash2, 
  Bell, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [userName, setUserName] = useState<string>('Guest');
  const [userInitial, setUserInitial] = useState<string>('G');

  useEffect(() => {
    // قراءة بيانات المستخدم المخزنة في localStorage بعد تسجيل الدخول
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        // إذا كان هناك اسم كامل أو بريد إلكتروني مسجل
        const nameOrEmail = user.fullName || user.email;
        if (nameOrEmail) {
          setUserName(nameOrEmail);
          setUserInitial(nameOrEmail.charAt(0).toUpperCase());
        }
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
  }, []);

  return (
    <aside className="sidebar-container">
      {/* القسم العلوي: المستخدم والقائمة الرئيسية */}
      <div className="sidebar-top">
        
        {/* بروفايل المستخدم بالاسم الفعلي */}
        <div className="sidebar-profile">
          <div className="profile-info">
            <div className="profile-avatar">
              {userInitial}
            </div>
            <span className="profile-name" title={userName}>{userName}</span>
          </div>
          <ChevronDown className="profile-arrow" />
        </div>

        {/* روابط التنقل الرئيسية */}
        <nav className="sidebar-nav">
          <button 
            type="button"
            onClick={() => setActiveTab('home')} 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          >
            <Home />
            <span>Home</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('discover')} 
            className={`nav-item ${activeTab === 'discover' ? 'active' : ''}`}
          >
            <Compass />
            <span>Discover</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('my-files')} 
            className={`nav-item ${activeTab === 'my-files' ? 'active' : ''}`}
          >
            <FileText />
            <span>My files</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('templates')} 
            className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`}
          >
            <LayoutGrid />
            <span>Templates</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('generate')} 
            className={`nav-item ${activeTab === 'generate' ? 'active' : ''}`}
          >
            <Sparkles />
            <span>Generate</span>
          </button>
        </nav>

        {/* بطاقة دعوة صديق */}
        <div className="refer-card">
          <div className="refer-header">
            <Zap />
            <span>Refer a friend</span>
          </div>
          <button type="button" className="refer-btn">
            Refer a friend
          </button>
        </div>
      </div>

      {/* القسم السفلي */}
      <div className="sidebar-bottom">
        <button 
          type="button"
          onClick={() => setActiveTab('archive')} 
          className={`nav-item ${activeTab === 'archive' ? 'active' : ''}`}
        >
          <Trash2 />
          <span>Archive</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('updates')} 
          className={`nav-item ${activeTab === 'updates' ? 'active' : ''}`}
        >
          <Bell />
          <span>Updates</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('help')} 
          className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
        >
          <HelpCircle />
          <span>Help & Feedback</span>
        </button>
      </div>
    </aside>
  );
}
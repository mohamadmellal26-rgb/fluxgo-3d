import { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Search, 
  Sparkles, 
  Plus, 
  Box, 
  PenTool, 
  Download, 
  ChevronDown,
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './home.css';

// تعريف هيكل المشروع القادم من السيرفر
interface Project {
  id: string;
  title: string;
  type: '3d' | '2d';
  previewGradient?: string;
  createdAt: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  // حالة نص البحث
  const [searchQuery, setSearchQuery] = useState('');

  // حالات خاصة بنافذة إدخال اسم المشروع
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<'3d' | '2d'>('3d');
  const [projectTitle, setProjectTitle] = useState('');

  // جلب المشاريع الخاصة بالمستخدم المسجل باستخدام التوكن عند تحميل الصفحة
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          setFetchingProjects(false);
          return;
        }

        const response = await fetch('https://fluxgo-3d.onrender.com/api/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setFetchingProjects(false);
      }
    };

    fetchUserProjects();
  }, []);

  // تصفية المشاريع بناءً على ما يتم كتابته في حقل البحث
  const filteredProjects = projects.filter((proj) =>
    proj.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // فتح نافذة إدخال الاسم واختيار النوع (3D أو 2D)
  const openCreateModal = (type: '3d' | '2d') => {
    setProjectType(type);
    setProjectTitle(type === '3d' ? 'My New 3D Project' : 'My New 2D Project');
    setIsModalOpen(true);
  };

  // دالة إرسال طلب إنشاء المشروع الفعلي للسيرفر بربطه مع التوكن والاسم المختار
  const handleConfirmCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('user_token');

      const response = await fetch('https://fluxgo-3d.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: projectTitle.trim() || (projectType === '3d' ? 'New 3D Project' : 'New 2D Project'),
          type: projectType, 
          previewGradient: projectType === '3d' ? 'linear-gradient(135deg, #2b1055, #674ea7)' : 'linear-gradient(135deg, #ff416c, #ff4b2b)',
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء المشروع وحفظه');
      }

      const project = await response.json();
      const projectToken = project.id || project.projectToken;

      setIsModalOpen(false);
      if (projectType === '3d') {
        navigate(`/editor3d/${projectToken}`);
      } else {
        navigate(`/editor2d/${projectToken}`);
      }

    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ أثناء إنشاء المشروع وحفظه في قاعدة البيانات، يرجى التأكد من تشغيل السيرفر على المنفذ 8080 وتسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      
      {/* الشريط العلوي */}
      <header className="home-header">
        <h1 className="home-title">Home</h1>

        <div className="home-actions">
          <button className="action-btn-outline">
            <FolderPlus className="w-4 h-4 text-gray-500" />
            <span>New Folder</span>
          </button>

          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by project name..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <button className="ai-gen-btn">
            <Sparkles className="w-4 h-4" />
            <span>AI 3D Generation</span>
          </button>

          <button className="create-dropdown-btn">
            <Plus className="w-4 h-4" />
            <span>Create</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>
      </header>

      {/* قسم كيف ترغب في البدء؟ */}
      <section className="start-section">
        <h2 className="section-title">How would you like to start?</h2>
        
        <div className="start-options-card">
          <div 
            onClick={() => openCreateModal('3d')} 
            className="start-option-item" 
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <Box />
            <span>3D Design</span>
          </div>

          <div 
            onClick={() => openCreateModal('2d')} 
            className="start-option-item" 
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <PenTool />
            <span>2D Design</span>
          </div>

          <div className="start-option-item">
            <Download />
            <span>Import</span>
          </div>
        </div>
      </section>

      {/* نافذة منبثقة (Modal) لإدخال اسم المشروع */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e1e24',
            padding: '2rem',
            borderRadius: '12px',
            width: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            color: '#fff',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>
              Create New {projectType.toUpperCase()} Project
            </h3>

            <form onSubmit={handleConfirmCreateProject}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#bbb' }}>
                  Project Name
                </label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter project name..."
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #444',
                    backgroundColor: '#2a2a35',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    border: '1px solid #555',
                    background: 'transparent',
                    color: '#ccc',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#6366f1',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Creating...' : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قسم المشاريع الأخيرة المحفوظة للمستخدم */}
      <section className="projects-section">
        <h2 className="section-title" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recent Projects</h2>
        
        {fetchingProjects ? (
          <p style={{ color: '#888' }}>Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p style={{ color: '#888' }}>No projects found matching your search.</p>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="project-card" 
                onClick={() => navigate(proj.type === '3d' ? `/editor3d/${proj.id}` : `/editor2d/${proj.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="project-preview" 
                  style={{ background: proj.previewGradient || 'linear-gradient(135deg, #2b1055, #674ea7)' }}
                ></div>
                <div className="project-info">
                  <div className="project-dot" style={{ backgroundColor: proj.type === '3d' ? '#ec4899' : '#3b82f6' }}></div>
                  <div className="project-details">
                    <h3>{proj.title}</h3>
                    <p>{proj.type.toUpperCase()} Project</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
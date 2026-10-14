import { Move, RotateCw, Maximize2, Eye, Download } from 'lucide-react';

interface EditorHeaderProps {
  activeTool: 'translate' | 'rotate' | 'scale';
  setActiveTool: (tool: 'translate' | 'rotate' | 'scale') => void;
  onExportGLB: () => void;
}

export default function EditorHeader({ activeTool, setActiveTool, onExportGLB }: EditorHeaderProps) {
  return (
    <header className="editor-topbar">
      <div className="topbar-left">
        <div className="app-badge-3d" />
        <h1>FluxGO 3D Studio</h1>
        <span className="project-status">Monochrome Environment</span>
      </div>

      <div className="topbar-tools">
        <button 
          className={`tool-btn ${activeTool === 'translate' ? 'active' : ''}`}
          onClick={() => setActiveTool('translate')}
          title="تحريك (Move)"
        >
          <Move size={18} />
        </button>
        <button 
          className={`tool-btn ${activeTool === 'rotate' ? 'active' : ''}`}
          onClick={() => setActiveTool('rotate')}
          title="تدوير (Rotate)"
        >
          <RotateCw size={18} />
        </button>
        <button 
          className={`tool-btn ${activeTool === 'scale' ? 'active' : ''}`}
          onClick={() => setActiveTool('scale')}
          title="تكبير/تصغير (Scale)"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="topbar-actions">
        <button className="editor-btn-secondary">
          <Eye size={16} />
          <span>معاينة العرض</span>
        </button>
        <button className="editor-btn-primary" onClick={onExportGLB} title="تصدير المشهد كملف GLB">
          <Download size={16} />
          <span>تصدير 3D (GLB)</span>
        </button>
      </div>
    </header>
  );
}
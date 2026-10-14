import { 
  Type, 
  Palette, 
  Sparkles, 
  EyeOff, 
  Maximize, 
  RotateCw, 
  Trash2 
} from 'lucide-react';

export interface SceneObject {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'text' | 'gltf';
  color: string;
  modelUrl?: string;
  materialType?: 'glossy' | 'matte' | 'glass';
  opacity?: number; 
  textValue?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface ObjectPropertiesPanelProps {
  selectedObject: SceneObject | undefined;
  onDeleteSelected: () => void;
  onTextValueChange: (text: string) => void;
  onColorChange: (color: string) => void;
  onMaterialChange: (materialType: 'glossy' | 'matte' | 'glass') => void;
  onOpacityChange: (opacity: number) => void;
  onPositionChange: (axis: 0 | 1 | 2, value: number) => void;
  onRotationChange: (axis: 0 | 1 | 2, value: number) => void;
  onScaleChange: (axis: 0 | 1 | 2, value: number) => void;
}

export default function ObjectPropertiesPanel({
  selectedObject,
  onDeleteSelected,
  onTextValueChange,
  onColorChange,
  onMaterialChange,
  onOpacityChange,
  onPositionChange,
  onRotationChange,
  onScaleChange
}: ObjectPropertiesPanelProps) {
  return (
    <aside className="sidebar-right-3d">
      <div className="panel-title">
        <span>خصائص العنصر (PROPERTIES)</span>
        {selectedObject && (
          <button onClick={onDeleteSelected} className="delete-obj-btn" title="حذف العنصر">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {selectedObject ? (
        <div className="properties-form">
          {/* اسم الكائن */}
          <div className="prop-group">
            <label>اسم الكائن</label>
            <input type="text" value={selectedObject.name} readOnly className="prop-input" />
          </div>

          {/* محتوى النص */}
          {selectedObject.type === 'text' && (
            <div className="prop-group">
              <label><Type size={14} /> محتوى النص (Text Content)</label>
              <input 
                type="text" 
                value={selectedObject.textValue || ''} 
                onChange={(e) => onTextValueChange(e.target.value)} 
                className="prop-input" 
              />
            </div>
          )}

          {/* اختيار اللون */}
          <div className="prop-group">
            <label><Palette size={14} /> اللون (Color)</label>
            <div className="color-picker-row">
              {['#ffffff', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'].map(c => (
                <button 
                  key={c}
                  className={`color-swatch ${selectedObject.color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => onColorChange(c)}
                />
              ))}
            </div>
          </div>

          {/* تأثير السطح */}
          {selectedObject.type !== 'text' && (
            <div className="prop-group">
              <label><Sparkles size={14} /> تأثير السطح (Material Effect)</label>
              <div className="material-buttons-row" style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  className={`editor-btn-secondary ${selectedObject.materialType === 'glossy' || !selectedObject.materialType ? 'active' : ''}`}
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center', borderColor: (selectedObject.materialType === 'glossy' || !selectedObject.materialType) ? '#ffffff' : '#2a2a2a' }}
                  onClick={() => onMaterialChange('glossy')}
                >
                  لامع (Glossy)
                </button>
                <button 
                  className={`editor-btn-secondary ${selectedObject.materialType === 'matte' ? 'active' : ''}`}
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center', borderColor: selectedObject.materialType === 'matte' ? '#ffffff' : '#2a2a2a' }}
                  onClick={() => onMaterialChange('matte')}
                >
                  مطفأ (Matte)
                </button>
                <button 
                  className={`editor-btn-secondary ${selectedObject.materialType === 'glass' ? 'active' : ''}`}
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center', borderColor: selectedObject.materialType === 'glass' ? '#ffffff' : '#2a2a2a' }}
                  onClick={() => onMaterialChange('glass')}
                >
                  زجاجي (Glass)
                </button>
              </div>
            </div>
          )}

          {/* نسبة الشفافية */}
          {selectedObject.type !== 'text' && (
            <div className="prop-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <EyeOff size={14} /> نسبة الشفافية (Opacity)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>
                  {Math.round((selectedObject.opacity ?? 1) * 100)}%
                </span>
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={selectedObject.opacity ?? 1} 
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#ffffff', cursor: 'pointer' }}
              />
            </div>
          )}

          {/* تحريك الموقع */}
          <div className="prop-group">
            <label>تحريك الموقع (Position X, Y, Z)</label>
            <div className="position-controls-grid">
              <div className="axis-control">
                <span>X</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.position[0]} 
                  onChange={(e) => onPositionChange(0, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Y</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.position[1]} 
                  onChange={(e) => onPositionChange(1, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Z</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.position[2]} 
                  onChange={(e) => onPositionChange(2, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
            </div>
          </div>

          {/* تدوير الكائن (Rotation X, Y, Z) */}
          <div className="prop-group">
            <label><RotateCw size={14} /> تدوير الكائن (Rotation X, Y, Z)</label>
            <div className="position-controls-grid">
              <div className="axis-control">
                <span>Rot X</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.rotation[0]} 
                  onChange={(e) => onRotationChange(0, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Rot Y</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.rotation[1]} 
                  onChange={(e) => onRotationChange(1, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Rot Z</span>
                <input 
                  type="number" 
                  step="0.1" 
                  value={selectedObject.rotation[2]} 
                  onChange={(e) => onRotationChange(2, parseFloat(e.target.value) || 0)} 
                  className="axis-input"
                />
              </div>
            </div>
          </div>

          {/* الطول والعرض (Scale X, Y, Z) */}
          <div className="prop-group">
            <label><Maximize size={14} /> الطول والعرض (Scale X, Y, Z)</label>
            <div className="position-controls-grid">
              <div className="axis-control">
                <span>Scale X</span>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  value={selectedObject.scale[0]} 
                  onChange={(e) => onScaleChange(0, parseFloat(e.target.value) || 1)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Scale Y</span>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  value={selectedObject.scale[1]} 
                  onChange={(e) => onScaleChange(1, parseFloat(e.target.value) || 1)} 
                  className="axis-input"
                />
              </div>
              <div className="axis-control">
                <span>Scale Z</span>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  value={selectedObject.scale[2]} 
                  onChange={(e) => onScaleChange(2, parseFloat(e.target.value) || 1)} 
                  className="axis-input"
                />
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="no-selection">الرجاء اختيار عنصر من المشهد للتعديل</div>
      )}
    </aside>
  );
}
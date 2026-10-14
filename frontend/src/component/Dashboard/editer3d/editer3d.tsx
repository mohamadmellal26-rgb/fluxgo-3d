import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Text, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { 
  Box, 
  Circle, 
  Cylinder, 
  Type, 
  Layers, 
  Upload
} from 'lucide-react';
import EditorHeader from './EditorHeader3d';
import ObjectPropertiesPanel from './ObjectPropertiesPanel';
import './editer3d.css';

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

function ImportedModel({ url, color, materialType, opacity }: { url?: string; color: string; materialType?: string; opacity?: number }) {
  if (!url) {
    return (
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.8, 0.3, 64, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
    );
  }

  const { scene } = useGLTF(url);
  const clonedScene = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      clonedScene.current = scene.clone();
      clonedScene.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mat = child.material.clone();
          if (color && color !== '#ffffff') {
            mat.color = new THREE.Color(color);
          }
          mat.roughness = materialType === 'matte' ? 0.9 : materialType === 'glass' ? 0.1 : 0.2;
          mat.metalness = materialType === 'matte' ? 0.1 : 0.5;
          mat.transparent = (opacity !== undefined && opacity < 1) || materialType === 'glass';
          mat.opacity = opacity !== undefined ? opacity : (materialType === 'glass' ? 0.6 : 1);
          mat.needsUpdate = true;
          child.material = mat;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene, color, materialType, opacity]);

  return clonedScene.current ? <primitive object={clonedScene.current} /> : null;
}

function MeshItem({ 
  obj, 
  isSelected, 
  onSelect, 
  activeTool,
  onUpdateTransform,
  onDragStateChange,
  registerMeshRef
}: { 
  obj: SceneObject; 
  isSelected: boolean; 
  onSelect: () => void;
  activeTool: 'translate' | 'rotate' | 'scale';
  onUpdateTransform: (id: string, pos: [number, number, number], rot: [number, number, number], scale: [number, number, number]) => void;
  onDragStateChange: (isDragging: boolean) => void;
  registerMeshRef: (id: string, ref: THREE.Group | null) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    registerMeshRef(obj.id, meshRef.current);
    return () => registerMeshRef(obj.id, null);
  }, [obj.id, registerMeshRef]);

  useEffect(() => {
    if (meshRef.current && !transformRef.current?.dragging) {
      meshRef.current.position.set(...obj.position);
      meshRef.current.rotation.set(...obj.rotation);
      meshRef.current.scale.set(...obj.scale);
    }
  }, [obj.position, obj.rotation, obj.scale]);

  const getMaterialProps = () => {
    const currentOpacity = obj.opacity !== undefined ? obj.opacity : 1;
    const isTransparent = currentOpacity < 1 || obj.materialType === 'glass';

    switch (obj.materialType) {
      case 'matte':
        return { roughness: 0.9, metalness: 0.1, transparent: isTransparent, opacity: currentOpacity };
      case 'glass':
        return { roughness: 0.1, metalness: 0.1, transparent: true, opacity: currentOpacity < 1 ? currentOpacity : 0.6, transmission: 0.9 };
      case 'glossy':
      default:
        return { roughness: 0.2, metalness: 0.5, transparent: isTransparent, opacity: currentOpacity };
    }
  };

  const matProps = getMaterialProps();

  return (
    <>
      <group 
        ref={meshRef}
        position={obj.position} 
        rotation={obj.rotation} 
        scale={obj.scale}
        onClick={(e) => { 
          e.stopPropagation(); 
          onSelect(); 
        }}
      >
        {obj.type === 'cube' && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color={obj.color} {...matProps} />
          </mesh>
        )}
        {obj.type === 'sphere' && (
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={obj.color} {...matProps} />
          </mesh>
        )}
        {obj.type === 'cylinder' && (
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
            <meshStandardMaterial color={obj.color} {...matProps} />
          </mesh>
        )}
        {obj.type === 'gltf' && (
          <ImportedModel url={obj.modelUrl} color={obj.color} materialType={obj.materialType} opacity={obj.opacity} />
        )}
        {obj.type === 'text' && (
          <Text
            fontSize={0.8}
            color={obj.color}
            anchorX="center"
            anchorY="middle"
          >
            {obj.textValue || '3D Text'}
          </Text>
        )}
      </group>

      {isSelected && meshRef.current && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode={activeTool}
          onMouseDown={() => onDragStateChange(true)}
          onMouseUp={() => {
            onDragStateChange(false);
            if (meshRef.current) {
              const m = meshRef.current;
              onUpdateTransform(
                obj.id,
                [
                  parseFloat(m.position.x.toFixed(2)),
                  parseFloat(m.position.y.toFixed(2)),
                  parseFloat(m.position.z.toFixed(2))
                ],
                [m.rotation.x, m.rotation.y, m.rotation.z],
                [
                  parseFloat(m.scale.x.toFixed(2)),
                  parseFloat(m.scale.y.toFixed(2)),
                  parseFloat(m.scale.z.toFixed(2))
                ]
              );
            }
          }}
          onObjectChange={() => {
            if (meshRef.current) {
              const m = meshRef.current;
              onUpdateTransform(
                obj.id,
                [
                  parseFloat(m.position.x.toFixed(2)),
                  parseFloat(m.position.y.toFixed(2)),
                  parseFloat(m.position.z.toFixed(2))
                ],
                [m.rotation.x, m.rotation.y, m.rotation.z],
                [
                  parseFloat(m.scale.x.toFixed(2)),
                  parseFloat(m.scale.y.toFixed(2)),
                  parseFloat(m.scale.z.toFixed(2))
                ]
              );
            }
          }}
        />
      )}
    </>
  );
}

export default function Editor() {
  const [objects, setObjects] = useState<SceneObject[]>([
    { id: '1', name: 'Cube_01', type: 'cube', color: '#3b82f6', materialType: 'glossy', opacity: 1, position: [0, 0.75, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    { id: '2', name: 'Text_01', type: 'text', color: '#ec4899', textValue: 'FluxGO 3D', position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  ]);
  
  const [selectedId, setSelectedId] = useState<string>('1');
  const [activeTool, setActiveTool] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [isDraggingObject, setIsDraggingObject] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const meshRefsMap = useRef<{ [id: string]: THREE.Group | null }>({});

  const selectedObject = objects.find(obj => obj.id === selectedId);

  // تحديث تحديد الكائن فقط دون تغيير مركز دوران الكاميرا الثابت
  const handleSelectObject = (id: string) => {
    setSelectedId(id);
  };

  const registerMeshRef = (id: string, ref: THREE.Group | null) => {
    meshRefsMap.current[id] = ref;
  };

  const handleAddObject = (type: 'cube' | 'sphere' | 'cylinder' | 'text' | 'gltf', modelUrl?: string) => {
    const newObj: SceneObject = {
      id: Date.now().toString(),
      name: `${type.toUpperCase()}_${objects.length + 1}`,
      type,
      color: '#ffffff',
      materialType: 'glossy',
      opacity: 1,
      modelUrl: modelUrl,
      textValue: type === 'text' ? 'New Text' : undefined,
      position: [parseFloat(((Math.random() - 0.5) * 4).toFixed(2)), 1, parseFloat(((Math.random() - 0.5) * 4).toFixed(2))],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleAddObject('gltf', url);
    }
  };

  const handleExportGLB = () => {
    const exporter = new GLTFExporter();
    const exportGroup = new THREE.Group();

    objects.forEach(obj => {
      const meshRef = meshRefsMap.current[obj.id];
      if (meshRef) {
        exportGroup.add(meshRef.clone());
      }
    });

    exporter.parse(
      exportGroup,
      (gltf: ArrayBuffer | { [key: string]: any }) => {
        let blob: Blob;
        if (gltf instanceof ArrayBuffer) {
          blob = new Blob([gltf], { type: 'application/octet-stream' });
        } else {
          const output = JSON.stringify(gltf, null, 2);
          blob = new Blob([output], { type: 'application/json' });
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = gltf instanceof ArrayBuffer ? 'fluxgo_scene.glb' : 'fluxgo_scene.gltf';
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      (error) => {
        console.error('An error occurred while exporting GLB:', error);
      },
      { binary: true }
    );
  };

  const handleDeleteSelected = () => {
    const remaining = objects.filter(obj => obj.id !== selectedId);
    setObjects(remaining);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setSelectedId('');
    }
  };

  const handleColorChange = (color: string) => {
    setObjects(objects.map(obj => obj.id === selectedId ? { ...obj, color } : obj));
  };

  const handleMaterialChange = (materialType: 'glossy' | 'matte' | 'glass') => {
    setObjects(objects.map(obj => {
      if (obj.id === selectedId) {
        const defaultOpacity = materialType === 'glass' ? 0.6 : (obj.opacity ?? 1);
        return { ...obj, materialType, opacity: defaultOpacity };
      }
      return obj;
    }));
  };

  const handleOpacityChange = (opacity: number) => {
    setObjects(objects.map(obj => obj.id === selectedId ? { ...obj, opacity: parseFloat(opacity.toFixed(2)) } : obj));
  };

  const handleUpdateTransform = (
    id: string,
    pos: [number, number, number], 
    rot: [number, number, number], 
    scale: [number, number, number]
  ) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        return { 
          ...obj, 
          position: [parseFloat(pos[0].toFixed(2)), parseFloat(pos[1].toFixed(2)), parseFloat(pos[2].toFixed(2))], 
          rotation: rot, 
          scale: [parseFloat(scale[0].toFixed(2)), parseFloat(scale[1].toFixed(2)), parseFloat(scale[2].toFixed(2))] 
        };
      }
      return obj;
    }));
  };

  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return;
    setObjects(objects.map(obj => {
      if (obj.id === selectedId) {
        const newPos: [number, number, number] = [...obj.position];
        newPos[axis] = parseFloat(value.toFixed(2));
        return { ...obj, position: newPos };
      }
      return obj;
    }));
  };

  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return;
    setObjects(objects.map(obj => {
      if (obj.id === selectedId) {
        const newRot: [number, number, number] = [...obj.rotation];
        newRot[axis] = parseFloat(value.toFixed(2));
        return { ...obj, rotation: newRot };
      }
      return obj;
    }));
  };

  const handleScaleChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return;
    setObjects(objects.map(obj => {
      if (obj.id === selectedId) {
        const newScale: [number, number, number] = [...obj.scale];
        newScale[axis] = Math.max(0.1, parseFloat(value.toFixed(2)));
        return { ...obj, scale: newScale };
      }
      return obj;
    }));
  };

  const handleTextValueChange = (textValue: string) => {
    if (!selectedObject) return;
    setObjects(objects.map(obj => obj.id === selectedId ? { ...obj, textValue } : obj));
  };

  return (
    <div className="editor-3d-container">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".gltf,.glb" 
        style={{ display: 'none' }} 
      />

      <EditorHeader 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        onExportGLB={handleExportGLB} 
      />

      <div className="editor-workspace-3d">
        
        <aside className="sidebar-left-3d">
          <h3>أدوات الإنشاء والاستيراد</h3>
          <div className="add-buttons-grid">
            <button onClick={() => handleAddObject('cube')} className="add-primitive-btn" title="Cube">
              <Box size={20} />
              <span>Cube</span>
            </button>
            <button onClick={() => handleAddObject('sphere')} className="add-primitive-btn" title="Sphere">
              <Circle size={20} />
              <span>Sphere</span>
            </button>
            <button onClick={() => handleAddObject('cylinder')} className="add-primitive-btn" title="Cylinder">
              <Cylinder size={20} />
              <span>Cylinder</span>
            </button>
            <button onClick={() => handleAddObject('text')} className="add-primitive-btn" title="3D Text">
              <Type size={20} />
              <span>Text</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="add-primitive-btn" title="استيراد نموذج 3D" style={{ gridColumn: 'span 2', borderColor: '#525252' }}>
              <Upload size={20} />
              <span>استيراد نموذج (GLTF/GLB)</span>
            </button>
          </div>

          <div className="scene-layers-section">
            <div className="layers-header">
              <Layers size={16} />
              <span>هيكل المشهد (Scene Graph)</span>
            </div>
            <div className="layers-list">
              {objects.map(obj => (
                <div 
                  key={obj.id} 
                  className={`layer-item ${obj.id === selectedId ? 'active' : ''}`}
                  onClick={() => handleSelectObject(obj.id)}
                >
                  <span className="dot" style={{ backgroundColor: obj.color }} />
                  <span>{obj.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="viewport-3d">
          <div className="viewport-overlay-info">
            <span>Monochrome Viewport</span>
            <span className="fps-counter">60 FPS</span>
          </div>

          <Canvas shadows camera={{ position: [5, 5, 7], fov: 45 }}>
            <color attach="background" args={['#080808']} />

            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[8, 12, 8]} 
              intensity={1.2} 
              castShadow 
              shadow-mapSize-width={1024} 
              shadow-mapSize-height={1024} 
            />
            <pointLight position={[-8, -5, -8]} intensity={0.3} />
            <Environment preset="studio" />

            <gridHelper args={[30, 30, '#ffffff', '#222222']} position={[0, 0, 0]} />

            {objects.map(obj => (
              <MeshItem 
                key={obj.id} 
                obj={obj} 
                isSelected={obj.id === selectedId} 
                onSelect={() => handleSelectObject(obj.id)}
                activeTool={activeTool}
                onUpdateTransform={handleUpdateTransform}
                onDragStateChange={(dragging) => setIsDraggingObject(dragging)}
                registerMeshRef={registerMeshRef}
              />
            ))}

            {/* مركز الدوران ثابت وطبيعي دون تغيير نقطة الارتكاز */}
            <OrbitControls makeDefault enabled={!isDraggingObject} />
          </Canvas>
        </main>

        <ObjectPropertiesPanel 
          selectedObject={selectedObject}
          onDeleteSelected={handleDeleteSelected}
          onTextValueChange={handleTextValueChange}
          onColorChange={handleColorChange}
          onMaterialChange={handleMaterialChange}
          onOpacityChange={handleOpacityChange}
          onPositionChange={handlePositionChange}
          onRotationChange={handleRotationChange}
          onScaleChange={handleScaleChange}
        />

      </div>
    </div>
  );
}
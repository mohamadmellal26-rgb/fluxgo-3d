import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Globe, Apple, Smartphone } from 'lucide-react';
import * as THREE from 'three';
import './InteractiveExportSection.css';

// مكون المكعب الزجاجي النظيف بدقة واضحة بدون توهج مبالغ فيه
const InteractiveCube: React.FC = () => {
  return (
    <group rotation={[0.4, 0.6, 0]}>
      {/* 1. هيكل المكعب الزجاجي الداخلي */}
      <mesh>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.05}
          transmission={0.85}
          thickness={0.8}
          ior={1.4}
        />
      </mesh>

      {/* 2. طبقة حواف واحدة وواضحة بدقة */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.2, 2.2, 2.2)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.5} linewidth={1.5} />
      </lineSegments>

      {/* 3. المحاور الثلاثة المتوازنة (Y - أزرق, X - أخضر, Z - أبيض) */}
      {/* محور Y (أزرق) */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
        <meshBasicMaterial color="#0088ff" />
      </mesh>

      {/* محور X (أخضر) */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
        <meshBasicMaterial color="#00ff66" />
      </mesh>

      {/* محور Z (أبيض) */}
      <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* نقطة المركز */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export const InteractiveExportSection: React.FC = () => {
  const [platform, setPlatform] = useState<'web' | 'apple' | 'android'>('web');
  const [framework, setFramework] = useState<string>('webflow');

  const snippets: Record<string, Record<string, string>> = {
    web: {
      webflow: '<fluxgo-viewer url="https://prod.fluxgo.design/scene" />',
      framer: 'import { FluxgoScene } from "@fluxgo/framer"\n\nexport default () => <FluxgoScene id="scene" />',
      react: 'import { Canvas3D } from "@fluxgo/react";\n\n<Canvas3D scene="https://prod.fluxgo.design/scene" />',
    },
    apple: {
      swiftui: 'import Fluxgo3D\n\nFluxgoView(sceneUrl: "https://prod.fluxgo.design/scene.usdz")',
      ios: 'let viewer = FluxgoiOSViewer(frame: self.view.bounds)\nviewer.loadScene("scene.usdz")',
    },
    android: {
      kotlin: 'val fluxgoView = FluxgoAndroidView(context)\nfluxgoView.loadScene("https://prod.fluxgo.design/scene.gltf")',
      jetpack: 'FluxgoComposable(sceneUrl = "https://prod.fluxgo.design/scene.gltf")',
    },
  };

  const frameworksByPlatform: Record<string, { id: string; label: string }[]> = {
    web: [
      { id: 'webflow', label: 'Webflow' },
      { id: 'framer', label: 'Framer' },
      { id: 'react', label: 'React' },
    ],
    apple: [
      { id: 'swiftui', label: 'SwiftUI' },
      { id: 'ios', label: 'UIKit / iOS' },
    ],
    android: [
      { id: 'kotlin', label: 'Kotlin' },
      { id: 'jetpack', label: 'Jetpack Compose' },
    ],
  };

  const handlePlatformChange = (p: 'web' | 'apple' | 'android') => {
    setPlatform(p);
    setFramework(frameworksByPlatform[p][0].id);
  };

  return (
    <section className="export-section">
      <div className="export-container">
        {/* Header */}
        <div className="export-header">
          <h2 className="export-title">
            Ship real-time experiences to the Web, <br />
            iOS and Android
          </h2>

          {/* Platform Tabs With Icons */}
          <div className="platform-tabs">
            <button
              className={`platform-btn ${platform === 'web' ? 'active' : ''}`}
              onClick={() => handlePlatformChange('web')}
            >
              <Globe size={16} className="tab-icon" />
              <span>Web</span>
            </button>
            <button
              className={`platform-btn ${platform === 'apple' ? 'active' : ''}`}
              onClick={() => handlePlatformChange('apple')}
            >
              <Apple size={16} className="tab-icon" />
              <span>Apple</span>
            </button>
            <button
              className={`platform-btn ${platform === 'android' ? 'active' : ''}`}
              onClick={() => handlePlatformChange('android')}
            >
              <Smartphone size={16} className="tab-icon" />
              <span>Android</span>
            </button>
          </div>
        </div>

        {/* Showcase Box */}
        <div className="showcase-box">
          {/* Left Canvas */}
          <div className="canvas-wrapper">
            <span className="canvas-hint">Press and drag to interact</span>
            <Canvas camera={{ position: [3.2, 2.8, 3.8], fov: 42 }}>
              <ambientLight intensity={1.2} />
              <InteractiveCube />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
            </Canvas>
          </div>

          {/* Right Code Area */}
          <div className="code-wrapper">
            <div className="code-header">
              <span className="code-title">
                {frameworksByPlatform[platform].find((f) => f.id === framework)?.label} Integration
              </span>
            </div>

            <div className="code-content">
              <pre>
                <code>{snippets[platform][framework]}</code>
              </pre>
            </div>

            <div className="framework-tabs">
              {frameworksByPlatform[platform].map((f) => (
                <button
                  key={f.id}
                  className={`framework-btn ${framework === f.id ? 'active' : ''}`}
                  onClick={() => setFramework(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveExportSection;
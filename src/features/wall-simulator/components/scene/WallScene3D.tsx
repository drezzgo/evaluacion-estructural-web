import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

import {
  useWallSimulatorStore,
  selectDimensions,
  selectSimulationResult,
  selectDamageLevel,
} from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';
import { WallFragmentOverlay } from './WallFragmentOverlay.tsx';
import { CrackPatternLayer } from './CrackPatternLayer.tsx';
import { CriticalFragmentHighlight } from './CriticalFragmentHighlight.tsx';
import { AppliedLoadIndicator } from './AppliedLoadIndicator.tsx';

function WallMesh() {
  const dimensions = useWallSimulatorStore(selectDimensions);
  const result = useWallSimulatorStore(selectSimulationResult);
  const level = useWallSimulatorStore(selectDamageLevel);

  const { widthM, heightM, thicknessM } = dimensions;
  const materialProps = result.material;
  const info = DAMAGE_LEVEL_INFO[level];

  const meshRef = useRef<THREE.Mesh>(null);

  // Convert Hex to THREE.Color for smooth interpolation
  const baseColor = new THREE.Color(materialProps.colorHex);
  const damageColor = new THREE.Color(info.colorHex);

  // Mix base material color with damage color based on utilization
  const currentColor = baseColor.clone().lerp(damageColor, info.visualIntensity);

  return (
    <group position={[0, heightM / 2, 0]}>
      <mesh
        ref={meshRef}
        // Re-create geometry safely when dimensions change
        key={`wall-${widthM}-${heightM}-${thicknessM}`}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[widthM, heightM, thicknessM]} />
        <meshStandardMaterial
          color={currentColor}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
        />
      </mesh>
      
      {/* Educational Fragment Overlays */}
      <WallFragmentOverlay />
      
      {/* Educational Cracks (boundaries between fragments) */}
      <CrackPatternLayer />

      {/* Critical Fragment Highlight */}
      <CriticalFragmentHighlight />

      {/* Applied Load Vector */}
      <AppliedLoadIndicator />
    </group>
  );
}

export function WallScene3D() {
  return (
    <div className="w-full h-full relative bg-gray-50/50">
      <Canvas
        camera={{ position: [5, 4, 6], fov: 45 }}
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Fondo sutil claro corporativo */}
        <color attach="background" args={['#f8fafc']} />
        
        {/* Iluminación adaptada a fondo claro */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.4} color="#ffffff" />

        <WallMesh />

        {/* OrbitControls allow rotating, zooming, and panning */}
        <OrbitControls makeDefault minDistance={2} maxDistance={20} maxPolarAngle={Math.PI / 2 - 0.05} />

        {/* Ground Plane (Grid claro) */}
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          fadeDistance={30}
          fadeStrength={1.5}
          cellColor="#cbd5e1"      // Slate 300
          sectionColor="#94a3b8"   // Slate 400
          cellThickness={0.5}
          sectionThickness={1}
          position={[0, 0, 0]}
        />
      </Canvas>

      {/* Label descriptivo flotante */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 font-medium pointer-events-none shadow-sm flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ea-light-blue animate-pulse"></span>
        Modelo 3D Interactivo
      </div>
    </div>
  );
}

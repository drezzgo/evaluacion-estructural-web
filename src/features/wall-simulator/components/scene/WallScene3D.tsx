import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

import {
  useWallSimulatorStore,
  selectDimensions,
  selectSimulationResult,
  selectDamageLevel,
  selectUtilizationRatio,
} from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';

function WallMesh() {
  const dimensions = useWallSimulatorStore(selectDimensions);
  const result = useWallSimulatorStore(selectSimulationResult);
  const level = useWallSimulatorStore(selectDamageLevel);
  const ratio = useWallSimulatorStore(selectUtilizationRatio);

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
    <mesh
      ref={meshRef}
      // Re-create geometry safely when dimensions change using the key prop
      key={`wall-${widthM}-${heightM}-${thicknessM}`}
      position={[0, heightM / 2, 0]}
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
  );
}

export function WallScene3D() {
  return (
    <div className="w-full h-full relative bg-[#111111]">
      <Canvas
        camera={{ position: [5, 4, 6], fov: 45 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#111111']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} />

        <WallMesh />

        {/* OrbitControls allow rotating, zooming, and panning */}
        <OrbitControls makeDefault />

        {/* Ground Plane */}
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          fadeDistance={30}
          fadeStrength={1}
          cellColor="#ffffff"
          sectionColor="#126DA6"
          cellThickness={0.5}
          sectionThickness={1}
          position={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

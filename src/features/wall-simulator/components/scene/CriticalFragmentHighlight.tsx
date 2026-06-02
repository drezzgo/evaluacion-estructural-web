import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useWallSimulatorStore, selectCriticalFragment, selectDimensions } from '../../state/wallSimulator.store.ts';

export function CriticalFragmentHighlight() {
  const criticalFrag = useWallSimulatorStore(selectCriticalFragment);
  const dimensions = useWallSimulatorStore(selectDimensions);
  
  const meshRef = useRef<THREE.Mesh>(null);
  const { widthM, heightM, thicknessM } = dimensions;
  
  // Slightly more forward than the regular overlay
  const zFront = thicknessM / 2 + 0.007;

  // Generate shape for the critical fragment
  const shapeData = useMemo(() => {
    if (!criticalFrag) return null;

    const shape = new THREE.Shape();
    
    criticalFrag.polygonPoints.forEach((p, index) => {
      const localX = p.x - widthM / 2;
      const localY = p.y - heightM / 2;
      
      if (index === 0) {
        shape.moveTo(localX, localY);
      } else {
        shape.lineTo(localX, localY);
      }
    });
    
    // Close the polygon
    if (criticalFrag.polygonPoints.length > 0) {
      const firstP = criticalFrag.polygonPoints[0];
      shape.lineTo(firstP.x - widthM / 2, firstP.y - heightM / 2);
    }

    return shape;
  }, [criticalFrag, widthM, heightM]);

  // Simple pulsing animation for the critical highlight
  useFrame((state) => {
    if (meshRef.current && criticalFrag?.damageLevel !== 'none') {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      // Pulse opacity between 0.3 and 0.6
      material.opacity = 0.45 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
    }
  });

  if (!shapeData || criticalFrag?.damageLevel === 'none') return null;

  return (
    <mesh ref={meshRef} position={[0, 0, zFront]}>
      <shapeGeometry args={[shapeData]} />
      {/* Intense red highlight with pulsing */}
      <meshBasicMaterial 
        color="#ef4444" 
        transparent 
        opacity={0.5} 
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

import { useMemo } from 'react';
import * as THREE from 'three';
import { useWallSimulatorStore, selectFragments, selectDimensions } from '../../state/wallSimulator.store.ts';

export function WallFragmentOverlay() {
  const fragments = useWallSimulatorStore(selectFragments);
  const dimensions = useWallSimulatorStore(selectDimensions);
  
  const { widthM, heightM, thicknessM } = dimensions;
  const zFront = thicknessM / 2 + 0.006; // Just above the wall face and crack lines

  // Generate Three.js Shapes for each fragment
  const shapesData = useMemo(() => {
    return fragments.map(frag => {
      const shape = new THREE.Shape();
      
      frag.polygonPoints.forEach((p, index) => {
        const localX = p.x - widthM / 2;
        const localY = p.y - heightM / 2;
        
        if (index === 0) {
          shape.moveTo(localX, localY);
        } else {
          shape.lineTo(localX, localY);
        }
      });
      // Close the polygon
      if (frag.polygonPoints.length > 0) {
        const firstP = frag.polygonPoints[0];
        shape.lineTo(firstP.x - widthM / 2, firstP.y - heightM / 2);
      }

      // Determine color and opacity based on damage level or utilization
      // Simple pedagogical colors:
      let color = '#3b82f6'; // Blue for safe
      let opacity = 0.05;

      if (frag.damageLevel === 'low') { color = '#eab308'; opacity = 0.15; } // Yellow
      else if (frag.damageLevel === 'moderate') { color = '#f97316'; opacity = 0.25; } // Orange
      else if (frag.damageLevel === 'severe') { color = '#ef4444'; opacity = 0.4; } // Red
      else if (frag.damageLevel === 'failure') { color = '#7f1d1d'; opacity = 0.5; } // Dark Red

      return { id: frag.id, shape, color, opacity };
    });
  }, [fragments, widthM, heightM]);

  if (fragments.length <= 1) return null; // Don't show overlays for completely healthy wall

  return (
    <group position={[0, 0, zFront]}>
      {shapesData.map(data => (
        <mesh key={data.id}>
          <shapeGeometry args={[data.shape]} />
          <meshBasicMaterial 
            color={data.color} 
            transparent 
            opacity={data.opacity} 
            side={THREE.DoubleSide} 
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

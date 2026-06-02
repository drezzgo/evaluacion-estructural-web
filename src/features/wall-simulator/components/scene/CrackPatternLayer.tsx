import { useMemo } from 'react';
import * as THREE from 'three';
import { useWallSimulatorStore, selectFragments, selectDimensions, selectCrackPatternType } from '../../state/wallSimulator.store.ts';

export function CrackPatternLayer() {
  const fragments = useWallSimulatorStore(selectFragments);
  const dimensions = useWallSimulatorStore(selectDimensions);
  const patternType = useWallSimulatorStore(selectCrackPatternType);

  const { widthM, heightM, thicknessM } = dimensions;
  const zFront = thicknessM / 2 + 0.005;

  const linesData = useMemo(() => {
    let segments: { start: {x:number,y:number}, end: {x:number,y:number} }[] = [];
    
    switch(patternType) {
      case 'horizontal':
        segments.push({ start: {x:0, y:0.5}, end: {x:1, y:0.5} });
        break;
      case 'vertical':
        segments.push({ start: {x:0.5, y:0}, end: {x:0.5, y:1} });
        break;
      case 'diagonal':
        segments.push({ start: {x:0, y:1}, end: {x:1, y:0} });
        break;
      case 'v-shape':
        segments.push({ start: {x:0, y:1}, end: {x:0.5, y:0} });
        segments.push({ start: {x:1, y:1}, end: {x:0.5, y:0} });
        break;
      case 'inverted-v':
        segments.push({ start: {x:0, y:0}, end: {x:0.5, y:1} });
        segments.push({ start: {x:1, y:0}, end: {x:0.5, y:1} });
        break;
      case 'x-shape':
        segments.push({ start: {x:0, y:0}, end: {x:1, y:1} });
        segments.push({ start: {x:0, y:1}, end: {x:1, y:0} });
        break;
    }
    
    return segments.map(seg => {
      const x1 = seg.start.x * widthM - widthM / 2;
      const y1 = seg.start.y * heightM - heightM / 2;
      const x2 = seg.end.x * widthM - widthM / 2;
      const y2 = seg.end.y * heightM - heightM / 2;
      
      const points = [];
      points.push(new THREE.Vector3(x1, y1, zFront));
      points.push(new THREE.Vector3(x2, y2, zFront));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
    });
  }, [patternType, widthM, heightM, zFront]);

  if (fragments.length <= 1 || linesData.length === 0) return null;

  return (
    <group>
      {linesData.map((geom, i) => (
        // @ts-ignore - R3F intercepts this, but React DOM types complain
        <line key={`crack-line-${i}`} geometry={geom}>
          <lineBasicMaterial color="#1a1a1a" transparent opacity={0.9} linewidth={2} />
        </line>
      ))}
    </group>
  );
}

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useWallSimulatorStore, selectLoad, selectDimensions, selectCriticalFragment } from '../../state/wallSimulator.store.ts';

export function AppliedLoadIndicator() {
  const load = useWallSimulatorStore(selectLoad);
  const dimensions = useWallSimulatorStore(selectDimensions);
  const criticalFrag = useWallSimulatorStore(selectCriticalFragment);
  
  const arrowGroupRef = useRef<THREE.Group>(null);
  
  const { widthM, heightM, thicknessM } = dimensions;

  // Determine status color based on critical fragment
  const { color, bg, border, warningText } = useMemo(() => {
    let c = '#0ea5e9'; // EA Blue (safe)
    let b = '#f0f9ff';
    let br = '#bae6fd';
    let text = 'Muro Estable';

    if (criticalFrag) {
      if (criticalFrag.damageLevel === 'low') { c = '#eab308'; b = '#fefce8'; br = '#fef08a'; text = 'Daño Leve'; }
      else if (criticalFrag.damageLevel === 'moderate') { c = '#f97316'; b = '#fff7ed'; br = '#fed7aa'; text = 'Daño Moderado'; }
      else if (criticalFrag.damageLevel === 'severe') { c = '#ef4444'; b = '#fef2f2'; br = '#fecaca'; text = 'Daño Severo'; }
      else if (criticalFrag.damageLevel === 'failure') { c = '#dc2626'; b = '#fef2f2'; br = '#fca5a5'; text = 'Falla Crítica'; }
    }
    return { color: c, bg: b, border: br, warningText: text };
  }, [criticalFrag]);

  // Calculate Application Point (P) and Direction Vector
  const { point, direction, rotation } = useMemo(() => {
    let p = new THREE.Vector3(0, 0, 0);
    let dir = new THREE.Vector3(0, -1, 0);
    let rot = new THREE.Euler(0, 0, 0);
    
    const posX = load.positionXNorm * widthM - widthM / 2;
    
    switch (load.direction) {
      case 'AXIAL':
        p.set(posX, heightM / 2, 0);
        dir.set(0, -1, 0);
        rot.set(0, 0, 0); // Default down
        break;
      case 'LATERAL':
        p.set(-widthM / 2, heightM / 2, 0);
        dir.set(1, 0, 0);
        rot.set(0, 0, Math.PI / 2); // Rotate Z to point right
        break;
      case 'OUT_OF_PLANE':
        p.set(posX, 0, thicknessM / 2);
        dir.set(0, 0, -1);
        rot.set(Math.PI / 2, 0, 0); // Rotate X to point back
        break;
      case 'COMBINED':
        p.set(-widthM / 2, heightM / 2, 0);
        dir.set(1, -1, 0).normalize();
        rot.set(0, 0, Math.PI / 4); // Rotate Z to point down-right
        break;
    }
    return { point: p, direction: dir, rotation: rot };
  }, [load.direction, load.positionXNorm, widthM, heightM, thicknessM]);

  // Arrow size based on magnitude
  const scale = useMemo(() => {
    const normalized = Math.min(Math.max(load.magnitudeKN / 2500, 0.6), 2.0);
    return normalized;
  }, [load.magnitudeKN]);

  // Animate arrow floating slightly to grab attention
  useFrame((state) => {
    if (arrowGroupRef.current) {
      const offset = Math.sin(state.clock.elapsedTime * 4) * 0.08;
      // Position arrow so its tip touches the application point + offset
      const shiftX = point.x - direction.x * offset;
      const shiftY = point.y - direction.y * offset;
      const shiftZ = point.z - direction.z * offset;
      
      arrowGroupRef.current.position.set(shiftX, shiftY, shiftZ);
    }
  });

  const fragmentsCount = useWallSimulatorStore(state => state.fragments.length);
  const isFragmented = fragmentsCount > 1;

  // Calculate connection line to critical fragment centroid
  const connectionLine = useMemo(() => {
    if (!criticalFrag || load.magnitudeKN === 0 || fragmentsCount <= 1) return null;
    
    const cx = criticalFrag.centroid.x - widthM / 2;
    const cy = criticalFrag.centroid.y - heightM / 2;
    const cz = thicknessM / 2 + 0.02; // Just above the front face

    // Connection starts slightly behind the point of application to avoid clipping the arrow head
    return {
      start: [point.x, point.y, cz] as [number, number, number],
      end: [cx, cy, cz] as [number, number, number]
    };
  }, [criticalFrag, point, widthM, heightM, thicknessM, load.magnitudeKN, fragmentsCount]);

  if (load.magnitudeKN === 0) return null;

  // Label Position (Tail of the arrow)
  const tailPos: [number, number, number] = [
    point.x - direction.x * (1.8 * scale),
    point.y - direction.y * (1.8 * scale),
    point.z - direction.z * (1.8 * scale)
  ];

  return (
    <group>
      {/* 3D Arrow Indicator (Local origin is exactly the tip pointing DOWN) */}
      <group ref={arrowGroupRef} rotation={rotation}>
        {/* Shaft */}
        <mesh position={[0, 1.0 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.04 * scale, 0.04 * scale, 1.6 * scale, 16]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.2 * scale, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.18 * scale, 0.4 * scale, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* Modern HTML Label at the tail of the arrow */}
      <Html position={tailPos} center distanceFactor={12} zIndexRange={[100, 0]}>
        <div 
          className="flex flex-col items-center justify-center px-3 py-2 rounded-xl shadow-md border backdrop-blur-md transition-colors pointer-events-none"
          style={{ backgroundColor: `${bg}F0`, borderColor: border, transform: 'translate3d(40px, -40px, 0)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 font-sans">Carga {load.direction}</span>
          </div>
          <span className="font-mono text-lg font-bold tabular-nums" style={{ color }}>
            {load.magnitudeKN.toFixed(0)} <span className="text-xs">kN</span>
          </span>
          {isFragmented && (
            <div className="mt-1 pt-1 border-t border-gray-200/50 flex items-center gap-1.5 w-full justify-center">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></span>
              <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color }}>{warningText}</span>
            </div>
          )}
        </div>
      </Html>

      {/* Connection Line to Critical Fragment */}
      {isFragmented && connectionLine && (
        <group>
          {/* Native Three.js dashed line */}
          {/* @ts-ignore - React DOM SVG types conflict with R3F line */}
          <line
            geometry={new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(...connectionLine.start),
              new THREE.Vector3(...connectionLine.end)
            ])}
            onUpdate={(line: THREE.Line) => line.computeLineDistances()}
          >
            <lineDashedMaterial
              color={color}
              linewidth={1}
              scale={1}
              dashSize={0.15}
              gapSize={0.1}
              transparent
              opacity={0.5}
            />
          </line>
          {/* Target marker at centroid */}
          <mesh position={connectionLine.end}>
            <circleGeometry args={[0.06, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
          <mesh position={connectionLine.end}>
            <ringGeometry args={[0.08, 0.1, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

import { Line } from '@react-three/drei';
import { useWallSimulatorStore, selectSimulationResult } from '../../state/wallSimulator.store.ts';

export function CrackLayer() {
  const result = useWallSimulatorStore(selectSimulationResult);
  const { crackPattern, dimensions } = result;

  if (!crackPattern || crackPattern.cracks.length === 0) {
    return null;
  }

  const { widthM, heightM, thicknessM } = dimensions;

  // The front face Z coordinate (slightly offset to avoid z-fighting)
  const zFront = thicknessM / 2 + 0.005;

  return (
    <group>
      {crackPattern.cracks.map((crack) => {
        // Map normalized coordinates [0, 1] to local 3D coordinates.
        // X: 0 is left (-widthM / 2), 1 is right (widthM / 2)
        // Y: 0 is bottom (-heightM / 2), 1 is top (heightM / 2)
        const startX = crack.startNorm.x * widthM - widthM / 2;
        const startY = crack.startNorm.y * heightM - heightM / 2;
        
        const endX = crack.endNorm.x * widthM - widthM / 2;
        const endY = crack.endNorm.y * heightM - heightM / 2;

        // Line thickness: mapped from widthMm. Minimum 1.5 units for visibility.
        const lineWidth = Math.max(1.5, crack.widthMm * 2);

        return (
          <Line
            key={crack.id}
            points={[
              [startX, startY, zFront],
              [endX, endY, zFront]
            ]}
            color="#1a1a1a" // Dark color for cracks
            lineWidth={lineWidth}
            transparent
            opacity={0.85}
          />
        );
      })}
    </group>
  );
}

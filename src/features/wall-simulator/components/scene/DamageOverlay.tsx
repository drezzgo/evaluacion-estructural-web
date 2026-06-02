import { useWallSimulatorStore, selectSimulationResult, selectDamageLevel } from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';

export function DamageOverlay() {
  const dimensions = useWallSimulatorStore((s) => s.dimensions);
  const result = useWallSimulatorStore(selectSimulationResult);
  const level = useWallSimulatorStore(selectDamageLevel);

  const { widthM, heightM, thicknessM } = dimensions;
  const info = DAMAGE_LEVEL_INFO[level];

  // If no damage or very low intensity, we can skip rendering the overlay or just render it transparently
  if (level === 'none' || info.visualIntensity <= 0.05) {
    return null;
  }

  // The overlay is placed slightly in front of the wall to avoid z-fighting.
  // We use a plane geometry matching the wall's front face.
  const zFront = thicknessM / 2 + 0.002;

  return (
    <mesh position={[0, 0, zFront]}>
      <planeGeometry args={[widthM, heightM]} />
      <meshBasicMaterial
        color={info.colorHex}
        transparent
        opacity={info.visualIntensity * 0.7} // Max 70% opacity to let base color show through
        depthWrite={false}
      />
    </mesh>
  );
}

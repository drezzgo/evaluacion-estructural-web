/**
 * @file evaluateWallFragments.ts
 * @description Evalúa el factor de seguridad y daño de cada fragmento individualmente.
 * 
 * ⚠️ AVISO EDUCATIVO: Modelo hiper-simplificado para demostración visual.
 */

import type { WallFragment, DamageLevel } from '../domain/wall.types.ts';
import type { AppliedLoad } from '../domain/load.types.ts';
import type { StructuralMaterial } from '../domain/material.types.ts';
import { calculateDamageLevel } from './calculateDamageLevel.ts';

const GRAVITY = 9.81;

/**
 * Evalúa cada fragmento repartiendo la carga total proporcionalmente a su área.
 * Matemáticamente irreal (la carga busca la rigidez), pero útil didácticamente
 * para destacar zonas más pequeñas como vulnerables o simplemente repartir colores.
 */
export function evaluateWallFragments(
  fragments: WallFragment[],
  load: AppliedLoad,
  material: StructuralMaterial,
  widthM: number // Needed for load position
): WallFragment[] {
  // Posición horizontal de la carga
  const loadPosX = load.positionXNorm * widthM;

  // Calcular pesos por proximidad (la carga viaja a los fragmentos más cercanos)
  let totalWeight = 0;
  const fragmentsWithWeight = fragments.map(frag => {
    const dist = Math.abs(loadPosX - frag.centroid.x);
    // Suavizado para evitar división por cero o concentraciones extremas
    const weight = 1 / (dist + 0.5); 
    totalWeight += weight;
    return { ...frag, weight };
  });

  const includeSW = load.includeSelfWeight;

  return fragmentsWithWeight.map(frag => {
    // 1. Carga aplicada (prorrateada por proximidad, no por área)
    const loadShareKN = load.magnitudeKN * (frag.weight / totalWeight);

    // 2. Peso propio del fragmento
    const selfWeightKN = includeSW ? (frag.volume * material.properties.densityKgM3 * GRAVITY) / 1000 : 0;
    const totalLoadKN = loadShareKN + selfWeightKN;

    // 3. Esfuerzo (Carga / Área)
    const estimatedStressMPa = totalLoadKN / 1000 / frag.area; // kN a MN para MPa

    // 4. Factor de seguridad
    const capacity = material.properties.compressiveStrengthMPa;
    let safetyFactor = 99;
    
    if (estimatedStressMPa > 0.001) {
      safetyFactor = capacity / estimatedStressMPa;
    }

    // 5. Utilización y nivel de daño
    const utilizationRatio = estimatedStressMPa / capacity;
    const damageLevel = calculateDamageLevel(safetyFactor);

    return {
      ...frag,
      estimatedStress: estimatedStressMPa,
      safetyFactor,
      utilizationRatio,
      damageLevel,
      isCritical: false
    };
  });
}

/**
 * Encuentra el fragmento más crítico (menor FS) y lo marca.
 */
export function findCriticalFragment(fragments: WallFragment[]): WallFragment[] {
  if (fragments.length === 0) return fragments;

  let minFS = Infinity;
  let criticalIdx = 0;

  fragments.forEach((frag, idx) => {
    if (frag.safetyFactor < minFS) {
      minFS = frag.safetyFactor;
      criticalIdx = idx;
    }
  });

  return fragments.map((frag, idx) => ({
    ...frag,
    isCritical: idx === criticalIdx
  }));
}

/**
 * @file generateWallFragments.ts
 * @description Genera fragmentos geométricos para un muro según un patrón de agrietamiento.
 * 
 * ⚠️ AVISO EDUCATIVO: Es un modelo simplificado puramente visual y didáctico.
 */

import type { CrackPatternType, WallDimensions, FragmentPolygon } from '../domain/wall.types.ts';
import { calculatePolygonArea, calculatePolygonCentroid } from './polygonMath.ts';

// Diccionario de patrones normalizados [0,1]
// El origen (0,0) es la esquina inferior izquierda.
const PATTERNS: Record<CrackPatternType, FragmentPolygon[]> = {
  'healthy': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }] }
  ],
  'horizontal': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0.5 }, { x: 0, y: 0.5 }] },
    { pointsNorm: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }, { x: 1, y: 1 }, { x: 0, y: 1 }] }
  ],
  'vertical': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 0.5, y: 1 }, { x: 0, y: 1 }] },
    { pointsNorm: [{ x: 0.5, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0.5, y: 1 }] }
  ],
  'diagonal': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }] }, // Triángulo inferior
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }] }  // Triángulo superior
  ],
  'v-shape': [
    { pointsNorm: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }, { x: 1, y: 1 }] }, // Triángulo V central
    { pointsNorm: [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 0, y: 1 }] }, // Lado izq
    { pointsNorm: [{ x: 0.5, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }] }  // Lado der
  ],
  'inverted-v': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.5, y: 1 }] }, // V invertida central
    { pointsNorm: [{ x: 0, y: 1 }, { x: 0.5, y: 1 }, { x: 0, y: 0 }] }, // Lado izq sup
    { pointsNorm: [{ x: 0.5, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }] }  // Lado der sup
  ],
  'x-shape': [
    { pointsNorm: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, // Inferior
    { pointsNorm: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0.5, y: 0.5 }] }, // Derecha
    { pointsNorm: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0.5, y: 0.5 }] }, // Superior
    { pointsNorm: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 0, y: 1 }] }  // Izquierda
  ]
};

/**
 * Genera fragmentos del muro basados en un patrón predefinido.
 * Calcula puntos reales en metros, área, volumen y centroide geométrico.
 */
export function generateWallFragments(dimensions: WallDimensions, patternType: CrackPatternType) {
  const { widthM, heightM, thicknessM } = dimensions;
  const pattern = PATTERNS[patternType] || PATTERNS['healthy'];

  return pattern.map((frag, index) => {
    // Escalar puntos normalizados a metros reales
    const polygonPoints = frag.pointsNorm.map(p => ({
      x: p.x * widthM,
      y: p.y * heightM
    }));

    const area = calculatePolygonArea(polygonPoints);
    const volume = area * thicknessM;
    const centroid = calculatePolygonCentroid(polygonPoints);

    return {
      id: `${patternType}-frag-${index + 1}`,
      label: `Fragmento ${index + 1}`,
      polygonPoints,
      area,
      volume,
      centroid,
      // Los resultados de evaluación se inicializan en 0, luego evaluateWallFragments los llenará
      estimatedStress: 0,
      safetyFactor: 99,
      utilizationRatio: 0,
      damageLevel: 'none' as const,
      isCritical: false
    };
  });
}

export function calculateFragmentVolumes(area: number, thickness: number): number {
  return area * thickness;
}

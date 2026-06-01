/**
 * @file generateCrackPattern.ts
 * @description Genera un patrón de grietas procedural basado en el nivel de daño.
 *
 * ⚠️ AVISO EDUCATIVO: La morfología y posición de las grietas son
 * generadas proceduralmente con base en patrones típicos de falla
 * descritos en la literatura de patología estructural. No representan
 * una predicción exacta de grietas en una estructura real.
 *
 * Patrones de referencia didáctica:
 *   - NSR-10 Título A (Generalidades)
 *   - Calavera, J. "Patología de estructuras de hormigón armado y pretensado"
 */

import type { CrackPattern, Crack, CrackType, DamageLevel } from '../domain/wall.types.ts';
import type { LoadDirection } from '../domain/load.types.ts';

// ---------------------------------------------------------------------------
// Generador de ID simple
// ---------------------------------------------------------------------------

let _crackCounter = 0;
function nextCrackId(): string {
  return `crack-${++_crackCounter}`;
}

// ---------------------------------------------------------------------------
// Generador de número seudoaleatório determinístico (sin Math.random)
// ---------------------------------------------------------------------------

/**
 * LCG (Linear Congruential Generator) simple para generar posiciones
 * reproducibles de grietas dado un mismo factor de seguridad y daño.
 * No usar para criptografía.
 */
function lcg(seed: number): () => number {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

// ---------------------------------------------------------------------------
// Mapas de tipo de grieta por dirección de carga
// ---------------------------------------------------------------------------

const CRACK_TYPE_BY_LOAD: Record<LoadDirection, CrackType[]> = {
  AXIAL: ['VERTICAL', 'DIAGONAL'],
  LATERAL: ['DIAGONAL', 'STEPPED'],
  OUT_OF_PLANE: ['HORIZONTAL', 'VERTICAL'],
  COMBINED: ['DIAGONAL', 'STEPPED', 'HORIZONTAL'],
};

// ---------------------------------------------------------------------------
// Cantidad de grietas por nivel de daño
// ---------------------------------------------------------------------------

const CRACK_COUNT_BY_DAMAGE: Record<DamageLevel, number> = {
  NONE: 0,
  MINOR: 2,
  MODERATE: 5,
  SEVERE: 10,
  CRITICAL: 18,
};

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Genera un patrón de grietas procedural para la visualización 3D.
 *
 * @param damageLevel   Nivel de daño calculado.
 * @param loadDirection Dirección de la carga (determina morfología de grietas).
 * @param safetyFactor  Usado como semilla para generación reproducible.
 * @returns             CrackPattern completo o null si no hay daño.
 */
export function generateCrackPattern(
  damageLevel: DamageLevel,
  loadDirection: LoadDirection,
  safetyFactor: number
): CrackPattern | null {
  if (damageLevel === 'NONE') return null;

  const count = CRACK_COUNT_BY_DAMAGE[damageLevel];
  const crackTypes = CRACK_TYPE_BY_LOAD[loadDirection];

  // Semilla reproducible: combinar FS (truncado) con la longitud del daño
  const seed = Math.round(safetyFactor * 1000) + damageLevel.length * 7;
  const rand = lcg(seed);

  const cracks: Crack[] = [];

  for (let i = 0; i < count; i++) {
    const type: CrackType = crackTypes[i % crackTypes.length]!;

    const startX = rand();
    const startY = rand();

    // La longitud de la grieta aumenta con el daño
    const lengthFactor = (i / count) * 0.4 + 0.05;
    let endX = startX;
    let endY = startY;

    switch (type) {
      case 'DIAGONAL':
        endX = clamp01(startX + lengthFactor * (rand() > 0.5 ? 1 : -1));
        endY = clamp01(startY + lengthFactor);
        break;
      case 'VERTICAL':
        endY = clamp01(startY + lengthFactor * 1.5);
        break;
      case 'HORIZONTAL':
        endX = clamp01(startX + lengthFactor * 1.5);
        break;
      case 'STEPPED':
        endX = clamp01(startX + lengthFactor * 0.5);
        endY = clamp01(startY + lengthFactor * 0.5);
        break;
    }

    // Ancho de grieta en mm — crece con el daño y el índice
    const widthMm = mapDamageToWidth(damageLevel) * (0.5 + rand() * 0.5);

    // Profundidad relativa — aumenta con severidad
    const depthRatio = mapDamageToDepth(damageLevel) * (0.6 + rand() * 0.4);

    cracks.push({
      id: nextCrackId(),
      type,
      startNorm: { x: startX, y: startY },
      endNorm: { x: endX, y: endY },
      widthMm,
      depthRatio,
    });
  }

  const damagedAreaPercent = mapDamageToArea(damageLevel);

  return { cracks, damageLevel, damagedAreaPercent };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function mapDamageToWidth(level: DamageLevel): number {
  const map: Record<DamageLevel, number> = {
    NONE: 0,
    MINOR: 0.05,     // hairline
    MODERATE: 0.3,   // visible
    SEVERE: 1.5,     // profunda
    CRITICAL: 5.0,   // colapso
  };
  return map[level];
}

function mapDamageToDepth(level: DamageLevel): number {
  const map: Record<DamageLevel, number> = {
    NONE: 0,
    MINOR: 0.1,
    MODERATE: 0.3,
    SEVERE: 0.6,
    CRITICAL: 0.95,
  };
  return map[level];
}

function mapDamageToArea(level: DamageLevel): number {
  const map: Record<DamageLevel, number> = {
    NONE: 0,
    MINOR: 5,
    MODERATE: 20,
    SEVERE: 50,
    CRITICAL: 85,
  };
  return map[level];
}

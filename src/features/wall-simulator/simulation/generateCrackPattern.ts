/**
 * @file generateCrackPattern.ts
 * @description Generador procedural de grietas basado en nivel de daño y dirección de carga.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  SIMULACIÓN EDUCATIVA — APROXIMACIÓN SIMPLIFICADA
 *
 * Las grietas son generadas proceduralmente inspiradas en patrones típicos
 * de patología estructural. NO predicen la ubicación real de grietas en
 * ninguna estructura. Son solo representaciones visuales educativas.
 *
 * Patrones de referencia didáctica:
 *   - Grieta diagonal de cortante (carga lateral)
 *   - Grieta vertical de tensión (carga axial excéntrica)
 *   - Grieta horizontal de flexión (carga fuera del plano)
 *   - Grieta escalonada en juntas (mampostería bajo cortante)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { CrackPattern, Crack, CrackType, DamageLevel } from '../domain/wall.types.ts';
import type { LoadDirection } from '../domain/load.types.ts';

// ─── Generador determinístico (LCG) ───────────────────────────────────────
//
// Usamos un Linear Congruential Generator en lugar de Math.random() para
// que el patrón de grietas sea REPRODUCIBLE dada la misma entrada.
// Esto facilita comparar simulaciones y evita "grietas que saltan" en la UI.

function makeLCG(seed: number): () => number {
  let state = (seed | 0) >>> 0;
  return (): number => {
    // Parámetros de Numerical Recipes (Knuth)
    state = ((1664525 * state + 1013904223) | 0) >>> 0;
    return state / 0x100000000;
  };
}

// ─── Tablas de configuración por nivel ────────────────────────────────────

/** Número de grietas generadas por nivel de daño. */
const CRACK_COUNT: Record<DamageLevel, number> = {
  none:     0,
  low:      2,
  moderate: 5,
  severe:   10,
  failure:  18,
};

/** Tipos de grieta predominantes según la dirección de carga. */
const CRACK_TYPES_BY_DIRECTION: Record<LoadDirection, CrackType[]> = {
  AXIAL:        ['VERTICAL', 'DIAGONAL'],
  LATERAL:      ['DIAGONAL', 'STEPPED'],
  OUT_OF_PLANE: ['HORIZONTAL', 'VERTICAL'],
  COMBINED:     ['DIAGONAL', 'STEPPED', 'HORIZONTAL'],
};

/** Ancho máximo de grieta en mm por nivel (para escala visual). */
const CRACK_WIDTH_MM: Record<DamageLevel, number> = {
  none:     0,
  low:      0.08,   // Hairline, solo con lupa
  moderate: 0.5,    // Visible a simple vista
  severe:   2.0,    // Ancha, preocupante
  failure:  6.0,    // Muy ancha, colapso inminente
};

/** Profundidad máxima relativa al espesor [0-1] por nivel. */
const CRACK_DEPTH: Record<DamageLevel, number> = {
  none:     0,
  low:      0.10,
  moderate: 0.35,
  severe:   0.65,
  failure:  0.95,
};

/** Porcentaje de área visible dañada [0-100] por nivel. */
const DAMAGED_AREA_PERCENT: Record<DamageLevel, number> = {
  none:     0,
  low:      4,
  moderate: 18,
  severe:   48,
  failure:  82,
};

// ─── Función principal ─────────────────────────────────────────────────────

/**
 * Genera un CrackPattern reproducible para la visualización 3D del muro.
 *
 * Retorna `null` cuando el nivel de daño es 'none' (muro sin grietas).
 *
 * Las coordenadas de cada grieta están normalizadas [0, 1] respecto al
 * ancho y alto del muro para que el componente Three.js pueda escalarlas
 * a cualquier dimensión real sin cambiar esta lógica.
 *
 * @param damageLevel    Nivel de daño calculado por el motor.
 * @param loadDirection  Dirección de la carga aplicada.
 * @param safetyFactor   Usado como semilla del RNG para reproducibilidad.
 * @returns              CrackPattern listo para la visualización, o null.
 */
export function generateCrackPattern(
  damageLevel:   DamageLevel,
  loadDirection: LoadDirection,
  safetyFactor:  number,
): CrackPattern | null {
  if (damageLevel === 'none') return null;

  const count      = CRACK_COUNT[damageLevel];
  const crackTypes = CRACK_TYPES_BY_DIRECTION[loadDirection];
  const maxWidthMm = CRACK_WIDTH_MM[damageLevel];
  const maxDepth   = CRACK_DEPTH[damageLevel];

  // Semilla reproducible: combinar FS (escaleado) con longitud de la cadena nivel
  // para que diferentes niveles con el mismo FS produzcan patrones distintos.
  const seed = Math.round(Math.abs(safetyFactor) * 1373) ^ (damageLevel.length * 97);
  const rand = makeLCG(seed);

  const cracks: Crack[] = [];

  for (let i = 0; i < count; i++) {
    // Tipo de grieta: rotamos entre los tipos disponibles para el modo de carga
    const type: CrackType = crackTypes[i % crackTypes.length]!;

    // Posición de inicio: distribuida sobre toda la cara del muro
    const startX = rand();
    const startY = rand();

    // Longitud relativa: crece con el índice y el nivel de daño
    const lengthFactor = lerp(0.08, 0.40, i / (count - 1 || 1));

    // Dirección del extremo final según morfología de la grieta
    const { endX, endY } = computeEnd(type, startX, startY, lengthFactor, rand);

    // Ancho y profundidad con variación aleatoria dentro del rango del nivel
    const widthMm   = maxWidthMm  * (0.4 + rand() * 0.6);
    const depthRatio = maxDepth   * (0.5 + rand() * 0.5);

    cracks.push({
      id:        `crack-${damageLevel}-${i}`,
      type,
      startNorm: { x: startX,  y: startY  },
      endNorm:   { x: endX,    y: endY    },
      widthMm,
      depthRatio,
    });
  }

  return {
    cracks,
    damageLevel,
    damagedAreaPercent: DAMAGED_AREA_PERCENT[damageLevel],
  };
}

// ─── Helpers privados ──────────────────────────────────────────────────────

/**
 * Calcula las coordenadas del extremo final de una grieta según su tipo.
 * Coordenadas normalizadas y restringidas a [0, 1].
 */
function computeEnd(
  type:         CrackType,
  sx:           number,
  sy:           number,
  lengthFactor: number,
  rand:         () => number,
): { endX: number; endY: number } {
  let dx = 0, dy = 0;

  switch (type) {
    case 'DIAGONAL':
      // Diagonal de cortante: sube en Y y se mueve lateralmente
      dx = lengthFactor * (rand() > 0.5 ? 1 : -1);
      dy = lengthFactor * (0.6 + rand() * 0.4);
      break;

    case 'VERTICAL':
      // Tensión axial: sube casi verticalmente
      dx = (rand() - 0.5) * lengthFactor * 0.2;  // ligera desviación
      dy = lengthFactor * 1.4;
      break;

    case 'HORIZONTAL':
      // Flexión fuera del plano: corre horizontalmente
      dx = lengthFactor * 1.4;
      dy = (rand() - 0.5) * lengthFactor * 0.15;
      break;

    case 'STEPPED':
      // Escalonada en juntas: movimiento mixto diagonal a 45°
      dx = lengthFactor * 0.7;
      dy = lengthFactor * 0.7;
      break;
  }

  return {
    endX: clamp01(sx + dx),
    endY: clamp01(sy + dy),
  };
}

/** Interpola linealmente entre a y b para t ∈ [0, 1]. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/** Restringe un valor al rango [0, 1]. */
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

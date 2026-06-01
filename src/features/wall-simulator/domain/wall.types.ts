/**
 * @file wall.types.ts
 * @description Tipos de dominio para las dimensiones físicas de un muro.
 *
 * ⚠️ AVISO EDUCATIVO: Los valores y cálculos de este simulador son
 * aproximaciones pedagógicas. NO reemplazan el criterio de un ingeniero
 * estructural certificado ni cumplen ninguna norma técnica (NSR-10, ACI, etc.).
 */

// ---------------------------------------------------------------------------
// Dimensiones del muro
// ---------------------------------------------------------------------------

/**
 * Dimensiones físicas del muro en metros.
 * Todas las propiedades están en unidades del Sistema Internacional (SI).
 */
export interface WallDimensions {
  /** Ancho del muro en metros. Rango típico educativo: 0.5 – 10 m */
  widthM: number;

  /** Altura del muro en metros. Rango típico educativo: 0.5 – 6 m */
  heightM: number;

  /** Grosor (espesor) del muro en metros. Rango típico educativo: 0.10 – 0.60 m */
  thicknessM: number;
}

// ---------------------------------------------------------------------------
// Estado de integridad del muro
// ---------------------------------------------------------------------------

/**
 * Nivel de daño estructural del muro.
 * Se asigna en función de la razón esfuerzo/resistencia.
 *
 * - NONE:     Sin daño visible. Esfuerzo < 30% de la resistencia.
 * - MINOR:    Microgrietas hairline. 30–55% de la resistencia.
 * - MODERATE: Grietas visibles. 55–80% de la resistencia.
 * - SEVERE:   Grietas profundas, pérdida de integridad. 80–95%.
 * - CRITICAL: Colapso inminente. > 95% de la resistencia.
 */
export type DamageLevel =
  | 'NONE'
  | 'MINOR'
  | 'MODERATE'
  | 'SEVERE'
  | 'CRITICAL';

// ---------------------------------------------------------------------------
// Grietas
// ---------------------------------------------------------------------------

/** Tipo de patrón de grieta según su morfología. */
export type CrackType =
  | 'DIAGONAL'    // Grieta diagonal de cortante
  | 'VERTICAL'    // Grieta vertical de tensión
  | 'HORIZONTAL'  // Grieta horizontal de flexión
  | 'STEPPED';    // Grieta escalonada en juntas de mampostería

/**
 * Representa una grieta individual en la superficie del muro.
 * Las coordenadas están normalizadas en el rango [0, 1] respecto
 * al ancho y alto del muro (0 = borde izquierdo/inferior, 1 = borde opuesto).
 */
export interface Crack {
  /** Identificador único de la grieta */
  id: string;

  /** Morfología de la grieta */
  type: CrackType;

  /** Punto de inicio normalizado [x: 0-1, y: 0-1] */
  startNorm: { x: number; y: number };

  /** Punto de fin normalizado [x: 0-1, y: 0-1] */
  endNorm: { x: number; y: number };

  /**
   * Ancho de la grieta en milímetros.
   * Referencia educativa: > 0.3 mm es visible a simple vista.
   */
  widthMm: number;

  /** Profundidad de la grieta relativa al espesor del muro [0-1] */
  depthRatio: number;
}

/**
 * Patrón general de grietas del muro.
 * Agrupa todas las grietas generadas y una severidad global.
 */
export interface CrackPattern {
  /** Lista de grietas individuales generadas */
  cracks: Crack[];

  /** Nivel de daño global del muro */
  damageLevel: DamageLevel;

  /**
   * Porcentaje aproximado del área visible con daño (0–100).
   * Solo informativo para visualización.
   */
  damagedAreaPercent: number;
}

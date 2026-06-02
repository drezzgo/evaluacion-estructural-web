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
 * Nivel de daño estructural del muro — modelo educativo simplificado.
 * Asignado en función del factor de seguridad (FS = capacidad / esfuerzo).
 *
 * | Nivel    | Factor de seguridad | Descripción visual                          |
 * |----------|---------------------|---------------------------------------------|
 * | none     | FS > 2.0            | Sin daño. Muro íntegro.                     |
 * | low      | 1.5 < FS ≤ 2.0      | Microgrietas hairline (< 0.1 mm).           |
 * | moderate | 1.0 < FS ≤ 1.5      | Grietas visibles (0.1–1 mm).                |
 * | severe   | 0.7 < FS ≤ 1.0      | Grietas profundas, pérdida de rigidez.      |
 * | failure  | FS ≤ 0.7            | Colapso estructural. Muro ha fallado.       |
 *
 * ⚠️ Aproximación educativa — no usar para diseño estructural real.
 */
export type DamageLevel =
  | 'none'
  | 'low'
  | 'moderate'
  | 'severe'
  | 'failure';

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

// ---------------------------------------------------------------------------
// Simulación por Fragmentos (Modelo Educativo)
// ---------------------------------------------------------------------------

export type CrackPatternType =
  | 'healthy'
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'v-shape'
  | 'inverted-v'
  | 'x-shape';

export interface FragmentPolygon {
  pointsNorm: { x: number; y: number }[];
}

export interface WallCrackPattern {
  type: CrackPatternType;
  fragments: FragmentPolygon[];
}

export interface FragmentSimulationResult {
  estimatedStressMPa: number;
  safetyFactor: number;
  utilizationRatio: number;
  damageLevel: DamageLevel;
  isCritical: boolean;
}

export interface FragmentFailureResult extends FragmentSimulationResult {
  // Se puede extender para más detalles de falla por fragmento
}

export interface WallFragment {
  id: string;
  label: string;
  polygonPoints: { x: number; y: number }[]; // En metros
  area: number; // m2
  volume: number; // m3
  centroid: { x: number; y: number }; // En metros
  
  // Resultados de evaluación (integrados directamente o vía interface)
  estimatedStress: number;
  safetyFactor: number;
  utilizationRatio: number;
  damageLevel: DamageLevel;
  isCritical: boolean;
}

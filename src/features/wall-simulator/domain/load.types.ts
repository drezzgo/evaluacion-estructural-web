/**
 * @file load.types.ts
 * @description Tipos de dominio para las cargas aplicadas al muro.
 *
 * ⚠️ AVISO EDUCATIVO: Las combinaciones de carga y los factores aquí
 * definidos son simplificaciones pedagógicas. El análisis estructural
 * real requiere el cumplimiento de la norma NSR-10 u otras aplicables.
 */

// ---------------------------------------------------------------------------
// Dirección de la carga
// ---------------------------------------------------------------------------

/**
 * Dirección en la que actúa la carga sobre el muro.
 *
 * - AXIAL:      Compresión vertical (peso propio + losa encima).
 * - LATERAL:    Fuerza horizontal en el plano del muro (sismo o viento).
 * - OUT_OF_PLANE: Fuerza perpendicular al plano del muro (presión de viento).
 * - COMBINED:   Combinación de axial + lateral (caso más crítico típico).
 */
export type LoadDirection =
  | 'AXIAL'
  | 'LATERAL'
  | 'OUT_OF_PLANE'
  | 'COMBINED';

// ---------------------------------------------------------------------------
// Carga aplicada
// ---------------------------------------------------------------------------

/**
 * Representa la carga estructural aplicada al muro.
 *
 * En el mundo real, las cargas se dividen en:
 *  - Carga muerta (D): peso propio del muro + elementos permanentes.
 *  - Carga viva (L): ocupación, almacenamiento.
 *  - Carga sísmica (E): fuerzas inerciales del sismo.
 *  - Carga de viento (W): presión lateral del viento.
 *
 * En este simulador usamos una carga total simplificada (kN) por claridad.
 */
export interface AppliedLoad {
  /**
   * Magnitud de la carga total aplicada en kilonewtons (kN).
   *
   * Referencia educativa:
   *  - 1 kN ≈ 101.9 kgf
   *  - Un muro de ladrillo de 1 m² y 15 cm de espesor pesa ≈ 2.7 kN
   */
  magnitudeKN: number;

  /** Dirección en que actúa la carga sobre el muro */
  direction: LoadDirection;

  /**
   * Posición normalizada de aplicación a lo largo del eje horizontal [0-1].
   * 0 = extremo izquierdo, 0.5 = centro, 1 = extremo derecho.
   * Solo relevante para cargas puntuales o excéntricas.
   */
  positionXNorm: number;

  /**
   * Posición normalizada de aplicación a lo largo del eje vertical [0-1].
   * 0 = base del muro, 1 = corona del muro.
   */
  positionYNorm: number;

  /**
   * Indica si la carga incluye la componente del peso propio del muro.
   * Cuando es true, el motor sumará automáticamente la carga muerta
   * calculada a partir de las dimensiones y la densidad del material.
   */
  includeSelfWeight: boolean;
}

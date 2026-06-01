/**
 * @file calculateDamageLevel.ts
 * @description Mapea el factor de seguridad a un nivel de daño estructural.
 *
 * ⚠️ AVISO EDUCATIVO: La correlación entre factor de seguridad y nivel
 * de daño visible en la estructura es un modelo simplificado. En la realidad,
 * el daño depende de la historia de carga, ciclos de fatiga, condiciones
 * de humedad, calidad de construcción y muchos otros factores.
 */

import type { DamageLevel } from '../domain/wall.types.ts';

// ---------------------------------------------------------------------------
// Umbrales educativos de daño vs. Factor de Seguridad
// ---------------------------------------------------------------------------

/**
 * Umbrales de factor de seguridad (FS) que determinan el nivel de daño.
 *
 * Nota: Estos valores son pedagógicos y representan rangos típicos
 * citados en literatura de ingeniería sísmica introductoria.
 */
const DAMAGE_THRESHOLDS = {
  /** FS > este valor → Sin daño */
  NONE_MIN_FS: 3.0,
  /** FS entre este valor y NONE → Daño menor (microgrietas) */
  MINOR_MIN_FS: 2.0,
  /** FS entre este valor y MINOR → Daño moderado (grietas visibles) */
  MODERATE_MIN_FS: 1.3,
  /** FS entre este valor y MODERATE → Daño severo (grietas profundas) */
  SEVERE_MIN_FS: 1.0,
  /** FS < SEVERE_MIN_FS → Estado crítico (falla estructural) */
} as const;

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Determina el nivel de daño estructural del muro en función del
 * factor de seguridad calculado.
 *
 * @param safetyFactor  Factor de seguridad FS (adimensional).
 * @returns             Nivel de daño asignado.
 */
export function calculateDamageLevel(safetyFactor: number): DamageLevel {
  if (safetyFactor > DAMAGE_THRESHOLDS.NONE_MIN_FS) {
    return 'NONE';
  }
  if (safetyFactor > DAMAGE_THRESHOLDS.MINOR_MIN_FS) {
    return 'MINOR';
  }
  if (safetyFactor > DAMAGE_THRESHOLDS.MODERATE_MIN_FS) {
    return 'MODERATE';
  }
  if (safetyFactor >= DAMAGE_THRESHOLDS.SEVERE_MIN_FS) {
    return 'SEVERE';
  }
  return 'CRITICAL';
}

// ---------------------------------------------------------------------------
// Helper: Descripción textual del nivel de daño
// ---------------------------------------------------------------------------

/** Mapa de mensajes educativos para cada nivel de daño. */
const DAMAGE_DESCRIPTIONS: Record<DamageLevel, string> = {
  NONE: '✅ El muro está dentro de los rangos seguros. No se espera daño visible.',
  MINOR:
    '🟡 Se pueden presentar microgrietas hairline (< 0.1 mm). Monitoreo recomendado.',
  MODERATE:
    '🟠 Grietas visibles esperadas (0.1–1 mm). Requiere inspección profesional.',
  SEVERE:
    '🔴 Grietas profundas y pérdida parcial de capacidad. Intervención urgente.',
  CRITICAL:
    '💀 Esfuerzo supera la resistencia del material. Riesgo de colapso inminente.',
};

/**
 * Retorna un mensaje descriptivo del nivel de daño para mostrar en la UI.
 */
export function getDamageDescription(level: DamageLevel): string {
  return DAMAGE_DESCRIPTIONS[level];
}

/**
 * @file calculateDamageLevel.ts
 * @description Mapea el factor de seguridad a un nivel de daño educativo.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  SIMULACIÓN EDUCATIVA — APROXIMACIÓN SIMPLIFICADA
 *
 * Los umbrales aquí definidos son convenciones pedagógicas, NO criterios
 * normativos. El daño real depende de historia de carga, ciclos de fatiga,
 * temperatura, calidad de ejecución y muchos otros factores.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { DamageLevel } from '../domain/wall.types.ts';

// ─── Umbrales del motor educativo ─────────────────────────────────────────
//
// Cada umbral marca el límite INFERIOR del nivel (FS debe ser mayor que el
// umbral para alcanzar ese nivel o superior).
//
//   FS > 2.0          → none
//   1.5 < FS ≤ 2.0   → low
//   1.0 < FS ≤ 1.5   → moderate
//   0.7 < FS ≤ 1.0   → severe
//   FS ≤ 0.7          → failure

const FS_NONE     = 2.0;  // Por encima → sin daño
const FS_LOW      = 1.5;  // Por encima → daño bajo
const FS_MODERATE = 1.0;  // Por encima → daño moderado
const FS_SEVERE   = 0.7;  // Por encima → daño severo; por debajo → falla

// ─── Función principal ─────────────────────────────────────────────────────

/**
 * Asigna un nivel de daño al muro basado en el factor de seguridad.
 *
 * Entrada segura: cualquier número (incluso NaN o Infinity) devuelve
 * un nivel válido sin romper la aplicación.
 *
 * @param safetyFactor  Factor de seguridad calculado (FS = capacidad / esfuerzo).
 * @returns             Nivel de daño educativo.
 */
export function calculateDamageLevel(safetyFactor: number): DamageLevel {
  // Guardia: NaN o valores extremos → máxima seguridad o falla obvia
  if (!Number.isFinite(safetyFactor) || safetyFactor <= 0) {
    return safetyFactor > 0 ? 'none' : 'failure';
  }

  if (safetyFactor > FS_NONE)     return 'none';
  if (safetyFactor > FS_LOW)      return 'low';
  if (safetyFactor > FS_MODERATE) return 'moderate';
  if (safetyFactor > FS_SEVERE)   return 'severe';
  return 'failure';
}

// ─── Metadata por nivel (para UI y visualizaciones) ───────────────────────

/** Información visual y textual de cada nivel de daño. */
export interface DamageLevelInfo {
  /** Etiqueta en español para mostrar en la UI. */
  label: string;

  /** Descripción educativa del estado estructural. */
  description: string;

  /**
   * Color hexadecimal semántico para la interfaz.
   * Diseñado para fondos oscuros (modo oscuro del simulador).
   */
  colorHex: string;

  /**
   * Intensidad de visualización del daño en el muro 3D.
   * Rango [0, 1]: 0 = muro limpio, 1 = muro completamente dañado.
   * Úsalo para mezclar texturas o modificar el color del material en R3F.
   */
  visualIntensity: number;

  /**
   * Rango de FS que produce este nivel (solo informativo para UI).
   */
  fsRange: string;
}

/** Registro completo de metadata por nivel de daño. */
export const DAMAGE_LEVEL_INFO: Record<DamageLevel, DamageLevelInfo> = {
  none: {
    label:           'Sin daño',
    description:     'El muro está dentro de rangos seguros. No se espera daño visible.',
    colorHex:        '#22c55e',  // verde
    visualIntensity: 0.0,
    fsRange:         'FS > 2.0',
  },
  low: {
    label:           'Daño leve',
    description:     'Posibles microgrietas hairline (< 0.1 mm). Solo visibles con lupa.',
    colorHex:        '#eab308',  // amarillo
    visualIntensity: 0.25,
    fsRange:         '1.5 < FS ≤ 2.0',
  },
  moderate: {
    label:           'Daño moderado',
    description:     'Grietas visibles (0.1–1 mm). Se recomienda inspección técnica.',
    colorHex:        '#f97316',  // naranja
    visualIntensity: 0.55,
    fsRange:         '1.0 < FS ≤ 1.5',
  },
  severe: {
    label:           'Daño severo',
    description:     'Grietas profundas y pérdida de rigidez. Intervención urgente.',
    colorHex:        '#ef4444',  // rojo
    visualIntensity: 0.80,
    fsRange:         '0.7 < FS ≤ 1.0',
  },
  failure: {
    label:           'Falla estructural',
    description:     'El esfuerzo supera la capacidad del material. Riesgo de colapso.',
    colorHex:        '#7f1d1d',  // rojo oscuro
    visualIntensity: 1.0,
    fsRange:         'FS ≤ 0.7',
  },
};

/**
 * Retorna la metadata completa de un nivel de daño.
 * Función auxiliar para la UI y el motor de renderizado.
 */
export function getDamageLevelInfo(level: DamageLevel): DamageLevelInfo {
  return DAMAGE_LEVEL_INFO[level];
}

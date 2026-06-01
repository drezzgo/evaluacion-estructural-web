/**
 * @file formatters.ts
 * @description Utilidades de formateo de valores numéricos para la UI del simulador.
 * Aseguran que los números se muestren con la precisión y las unidades correctas.
 */

import type { DamageLevel } from '../domain/wall.types.ts';

// ---------------------------------------------------------------------------
// Números
// ---------------------------------------------------------------------------

/**
 * Formatea un número con un número fijo de decimales.
 * Usa la notación de punto (inglés) para consistencia.
 *
 * @example
 * formatDecimal(3.14159, 2) // → "3.14"
 */
export function formatDecimal(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

/**
 * Formatea un esfuerzo en MPa con 2 decimales y su unidad.
 * @example formatMPa(21.3) // → "21.30 MPa"
 */
export function formatMPa(mpa: number): string {
  return `${mpa.toFixed(2)} MPa`;
}

/**
 * Formatea una fuerza en kN con 1 decimal y su unidad.
 * @example formatKN(150.7) // → "150.7 kN"
 */
export function formatKN(kn: number): string {
  return `${kn.toFixed(1)} kN`;
}

/**
 * Formatea una distancia en metros con 2 decimales.
 * @example formatMeters(3.5) // → "3.50 m"
 */
export function formatMeters(m: number): string {
  return `${m.toFixed(2)} m`;
}

/**
 * Formatea un factor de seguridad.
 * Muestra máximo 2 decimales; si es > 10, muestra "> 10".
 */
export function formatSafetyFactor(fs: number): string {
  if (fs > 10) return '> 10.00';
  return fs.toFixed(2);
}

/**
 * Formatea la deformación unitaria como microstrain (με).
 * 1 microstrain = 1 × 10⁻⁶ m/m
 */
export function formatStrain(strain: number): string {
  const microstrain = strain * 1_000_000;
  return `${microstrain.toFixed(0)} με`;
}

/**
 * Formatea un porcentaje con 1 decimal.
 * @example formatPercent(85.5) // → "85.5 %"
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

// ---------------------------------------------------------------------------
// Nivel de daño
// ---------------------------------------------------------------------------

/** Mapa de etiquetas legibles en español por nivel de daño. */
const DAMAGE_LABELS: Record<DamageLevel, string> = {
  none:     'Sin daño',
  low:      'Daño leve',
  moderate: 'Daño moderado',
  severe:   'Daño severo',
  failure:  'Falla estructural',
};

/** Clases de color Tailwind semánticas por nivel de daño (modo oscuro del simulador). */
const DAMAGE_COLORS: Record<DamageLevel, string> = {
  none:     'text-green-400',
  low:      'text-yellow-400',
  moderate: 'text-orange-400',
  severe:   'text-red-500',
  failure:  'text-red-700',
};

/**
 * Retorna la etiqueta legible de un nivel de daño en español.
 */
export function formatDamageLevel(level: DamageLevel): string {
  return DAMAGE_LABELS[level];
}

/**
 * Retorna la clase de color Tailwind para el nivel de daño.
 * Uso: `<span className={getDamageColor(level)}>{label}</span>`
 */
export function getDamageColor(level: DamageLevel): string {
  return DAMAGE_COLORS[level];
}

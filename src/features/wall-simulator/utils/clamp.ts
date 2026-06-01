/**
 * @file clamp.ts
 * @description Utilidades de constricción de valores numéricos (clamping).
 * Usadas para mantener parámetros dentro de rangos válidos en la simulación.
 */

/**
 * Restringe un valor al rango [min, max].
 * Si value < min, retorna min.
 * Si value > max, retorna max.
 * De lo contrario, retorna value sin cambios.
 *
 * @example
 * clamp(150, 0, 100) // → 100
 * clamp(-5, 0, 100)  // → 0
 * clamp(42, 0, 100)  // → 42
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Restringe un valor al rango [0, 1].
 * Útil para coordenadas normalizadas de grietas y ratios de daño.
 */
export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Restringe un valor a un mínimo, sin límite superior.
 */
export function clampMin(value: number, min: number): number {
  return value < min ? min : value;
}

/**
 * Restringe un valor a un máximo, sin límite inferior.
 */
export function clampMax(value: number, max: number): number {
  return value > max ? max : value;
}

/**
 * Interpola linealmente entre dos valores dado un parámetro t ∈ [0, 1].
 * Útil para transiciones suaves en la visualización 3D.
 *
 * @example
 * lerp(0, 100, 0.5) // → 50
 * lerp(0, 100, 0.25) // → 25
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Normaliza un valor dentro del rango [min, max] al rango [0, 1].
 * Inverso de lerp.
 *
 * @example
 * inverseLerp(0, 100, 50) // → 0.5
 */
export function inverseLerp(min: number, max: number, value: number): number {
  if (max === min) return 0;
  return clamp01((value - min) / (max - min));
}

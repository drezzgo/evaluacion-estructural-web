/**
 * @file units.ts
 * @description Utilidades de conversión entre unidades para el simulador.
 *
 * El simulador trabaja internamente en SI:
 *   - Longitudes: metros (m)
 *   - Fuerzas: kilonewtons (kN)
 *   - Esfuerzos: megapascales (MPa)
 *   - Masa: kilogramos (kg)
 */

/** Factor de conversión: kN → kgf */
export const KN_TO_KGF = 101.971621;

/** Factor de conversión: kgf → kN */
export const KGF_TO_KN = 1 / KN_TO_KGF;

/** Factor de conversión: MPa → kgf/cm² */
export const MPA_TO_KGF_CM2 = 10.1971621;

/** Factor de conversión: kgf/cm² → MPa */
export const KGF_CM2_TO_MPA = 1 / MPA_TO_KGF_CM2;

/** Factor de conversión: MPa → PSI */
export const MPA_TO_PSI = 145.0377;

/** Factor de conversión: PSI → MPa */
export const PSI_TO_MPA = 1 / MPA_TO_PSI;

/** Factor de conversión: metros → centímetros */
export const M_TO_CM = 100;

/** Factor de conversión: centímetros → metros */
export const CM_TO_M = 0.01;

/** Gravedad estándar en m/s² */
export const GRAVITY_MS2 = 9.807;

// ---------------------------------------------------------------------------
// Funciones de conversión
// ---------------------------------------------------------------------------

/** Convierte kilonewtons a kilogramos-fuerza */
export function kNToKgf(kN: number): number {
  return kN * KN_TO_KGF;
}

/** Convierte kilogramos-fuerza a kilonewtons */
export function kgfToKN(kgf: number): number {
  return kgf * KGF_TO_KN;
}

/** Convierte MPa a kgf/cm² (unidad común en Colombia) */
export function mpaToKgfCm2(mpa: number): number {
  return mpa * MPA_TO_KGF_CM2;
}

/** Convierte MPa a PSI (unidad común en especificaciones ASTM) */
export function mpaToPsi(mpa: number): number {
  return mpa * MPA_TO_PSI;
}

/** Convierte metros a centímetros */
export function mToCm(m: number): number {
  return m * M_TO_CM;
}

/**
 * Calcula el peso en kN dado un volumen en m³ y densidad en kg/m³.
 * Fórmula: P = ρ × V × g / 1000
 */
export function weightKN(volumeM3: number, densityKgM3: number): number {
  return (densityKgM3 * volumeM3 * GRAVITY_MS2) / 1000;
}

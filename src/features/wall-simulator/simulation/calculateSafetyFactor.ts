/**
 * @file calculateSafetyFactor.ts
 * @description Cálculo del factor de seguridad simplificado del muro.
 *
 * ⚠️ AVISO EDUCATIVO: Esta función implementa mecánica de materiales
 * elemental (σ = P/A) con fines pedagógicos. El análisis estructural
 * real considera combinaciones de carga, factores de amplificación,
 * reducción de capacidad (φ) y muchos otros factores normativos.
 */

import type { WallDimensions } from '../domain/wall.types.ts';
import type { StructuralMaterial } from '../domain/material.types.ts';
import type { AppliedLoad } from '../domain/load.types.ts';

// ---------------------------------------------------------------------------
// Constante de gravedad
// ---------------------------------------------------------------------------

/** Aceleración gravitacional estándar (m/s²) */
const G_MS2 = 9.807;

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Calcula el factor de seguridad (FS) del muro ante una carga aplicada.
 *
 * Metodología simplificada educativa:
 *   1. Calcular el área transversal del muro: A = ancho × espesor (m²)
 *   2. Calcular el esfuerzo actuante: σ = P_total / A (MPa)
 *   3. Comparar con la resistencia del material según la dirección de carga.
 *   4. FS = Resistencia / Esfuerzo_actuante
 *
 * @param dimensions  Dimensiones físicas del muro en metros.
 * @param material    Material con sus propiedades mecánicas.
 * @param load        Carga aplicada en kN con dirección.
 * @returns           Factor de seguridad (adimensional). FS ≥ 1 → seguro.
 */
export function calculateSafetyFactor(
  dimensions: WallDimensions,
  material: StructuralMaterial,
  load: AppliedLoad
): number {
  const { widthM, heightM, thicknessM } = dimensions;
  const props = material.properties;

  // Área transversal horizontal del muro (plano resistente a compresión)
  const crossSectionAreaM2 = widthM * thicknessM;

  // Área transversal vertical (para cortante en plano)
  const shearAreaM2 = widthM * heightM;

  // Peso propio: ρ × V × g → en kN
  const selfWeightKN =
    (props.densityKgM3 * widthM * heightM * thicknessM * G_MS2) / 1000;

  // Carga total considerando peso propio (si aplica)
  const totalLoadKN = load.includeSelfWeight
    ? load.magnitudeKN + selfWeightKN
    : load.magnitudeKN;

  // Convertir kN → MN para obtener MPa después de dividir por m²
  const totalLoadMN = totalLoadKN / 1000;

  let actuatingStressMPa: number;
  let resistanceMPa: number;

  switch (load.direction) {
    case 'AXIAL':
      // Esfuerzo axial de compresión: σ = P / A
      actuatingStressMPa = totalLoadMN / crossSectionAreaM2;
      resistanceMPa = props.compressiveStrengthMPa;
      break;

    case 'LATERAL':
      // Esfuerzo de cortante simplificado: τ = V / A_shear
      actuatingStressMPa = totalLoadMN / shearAreaM2;
      resistanceMPa = props.shearStrengthMPa;
      break;

    case 'OUT_OF_PLANE':
      // Fuerza perpendicular — generalmente governa tensión por flexión
      // Simplificación: tratar como tensión distribuida
      actuatingStressMPa = totalLoadMN / crossSectionAreaM2;
      resistanceMPa = props.tensileStrengthMPa;
      break;

    case 'COMBINED':
      // Interacción compresión + cortante (criterio simplificado de Coulomb)
      // FS_combinado = 1 / (σ/fc + τ/fv) — simplificación didáctica
      const compressiveStress = totalLoadMN / crossSectionAreaM2;
      const shearStress = (totalLoadMN * 0.3) / shearAreaM2;
      const interactionRatio =
        compressiveStress / props.compressiveStrengthMPa +
        shearStress / props.shearStrengthMPa;
      // Retornar FS directamente desde la razón de interacción
      return clampMin(1 / interactionRatio, 0.01);

    default:
      actuatingStressMPa = totalLoadMN / crossSectionAreaM2;
      resistanceMPa = props.compressiveStrengthMPa;
  }

  // Evitar división por cero
  if (actuatingStressMPa <= 0) return 99;

  return clampMin(resistanceMPa / actuatingStressMPa, 0.01);
}

/** Asegura que el valor no baje de un mínimo (evita FS negativos). */
function clampMin(value: number, min: number): number {
  return value < min ? min : value;
}

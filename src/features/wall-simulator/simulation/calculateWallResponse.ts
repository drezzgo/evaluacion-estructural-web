/**
 * @file calculateWallResponse.ts
 * @description Orquestador principal de la simulación. Combina todos los
 * módulos de cálculo y retorna un WallSimulationResult completo.
 *
 * ⚠️ AVISO EDUCATIVO: Este módulo implementa mecánica de materiales
 * elemental con fines pedagógicos. Los resultados son aproximaciones
 * simplificadas y NO sustituyen un análisis estructural profesional.
 */

import type { WallDimensions } from '../domain/wall.types.ts';
import type { StructuralMaterial } from '../domain/material.types.ts';
import type { AppliedLoad } from '../domain/load.types.ts';
import type { WallSimulationResult, WallStresses } from '../domain/simulation.types.ts';
import { calculateSafetyFactor } from './calculateSafetyFactor.ts';
import { calculateDamageLevel, getDamageDescription } from './calculateDamageLevel.ts';
import { generateCrackPattern } from './generateCrackPattern.ts';

// ---------------------------------------------------------------------------
// Constante de gravedad
// ---------------------------------------------------------------------------

const G_MS2 = 9.807;

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Ejecuta la simulación completa del muro y retorna todos los resultados.
 *
 * Flujo:
 *   1. Calcular área transversal y peso propio.
 *   2. Determinar carga total.
 *   3. Calcular esfuerzos internos (compresión, tensión, cortante, deformación).
 *   4. Calcular factor de seguridad.
 *   5. Mapear FS a nivel de daño.
 *   6. Generar patrón de grietas.
 *   7. Ensamblar y retornar WallSimulationResult.
 *
 * @param dimensions  Dimensiones del muro en metros.
 * @param material    Material seleccionado con propiedades mecánicas.
 * @param load        Carga aplicada (magnitud + dirección).
 * @returns           Resultado completo de la simulación.
 */
export function calculateWallResponse(
  dimensions: WallDimensions,
  material: StructuralMaterial,
  load: AppliedLoad
): WallSimulationResult {
  const { widthM, heightM, thicknessM } = dimensions;
  const props = material.properties;

  // --- Geometría ---
  const crossSectionAreaM2 = widthM * thicknessM;     // Área horizontal (m²)
  const shearAreaM2 = widthM * heightM;               // Área vertical (m²)
  const volumeM3 = widthM * heightM * thicknessM;     // Volumen (m³)

  // --- Peso propio ---
  const selfWeightKN = (props.densityKgM3 * volumeM3 * G_MS2) / 1000;

  // --- Carga total ---
  const totalLoadKN = load.includeSelfWeight
    ? load.magnitudeKN + selfWeightKN
    : load.magnitudeKN;

  const totalLoadMN = totalLoadKN / 1000;

  // --- Esfuerzos calculados (simplificados) ---
  const compressiveMPa = totalLoadMN / crossSectionAreaM2;
  const tensileMPa =
    load.direction === 'OUT_OF_PLANE'
      ? compressiveMPa * 0.8
      : compressiveMPa * 0.1; // tensión secundaria siempre presente
  const shearMPa =
    load.direction === 'LATERAL' || load.direction === 'COMBINED'
      ? totalLoadMN / shearAreaM2
      : compressiveMPa * 0.1;

  // Deformación unitaria: ε = σ / E (convertir MPa y GPa a unidades consistentes)
  const strainUnitless = compressiveMPa / (props.elasticModulusGPa * 1000);

  const stresses: WallStresses = {
    compressiveMPa,
    tensileMPa,
    shearMPa,
    strainUnitless,
  };

  // --- Factor de seguridad ---
  const safetyFactor = calculateSafetyFactor(dimensions, material, load);

  // --- Nivel de daño ---
  const damageLevel = calculateDamageLevel(safetyFactor);

  // --- Patrón de grietas ---
  const crackPattern = generateCrackPattern(
    damageLevel,
    load.direction,
    safetyFactor
  );

  // --- Capacidad máxima del muro ---
  const maxCapacityKN = props.compressiveStrengthMPa * crossSectionAreaM2 * 1000;

  return {
    dimensions,
    material,
    load,
    stresses,
    safetyFactor,
    damageLevel,
    crackPattern,
    maxCapacityKN,
    selfWeightKN,
    totalLoadKN,
    statusMessage: getDamageDescription(damageLevel),
  };
}

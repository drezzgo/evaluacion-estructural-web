/**
 * @file calculateWallResponse.ts
 * @description Orquestador principal del motor de simulación educativa.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  SIMULACIÓN EDUCATIVA — APROXIMACIÓN SIMPLIFICADA
 *
 * Este módulo coordina todos los módulos de cálculo y produce un
 * WallSimulationResult completo. Los resultados son aproximaciones
 * pedagógicas basadas en mecánica de materiales elemental.
 *
 * Flujo de cálculo:
 *   1. Validar entradas (guardar defaults seguros si son inválidas).
 *   2. Calcular esfuerzos internos simplificados.
 *   3. Calcular FS y razón de utilización.
 *   4. Mapear FS → nivel de daño.
 *   5. Generar patrón de grietas procedural (reproducible).
 *   6. Calcular capacidad máxima y métricas auxiliares.
 *   7. Retornar resultado inmutable (snapshot de la simulación).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { WallDimensions }       from '../domain/wall.types.ts';
import type { StructuralMaterial }   from '../domain/material.types.ts';
import type { AppliedLoad }          from '../domain/load.types.ts';
import type { WallSimulationResult, WallStresses } from '../domain/simulation.types.ts';
import { calculateSafetyFactor }     from './calculateSafetyFactor.ts';
import { calculateDamageLevel, getDamageLevelInfo } from './calculateDamageLevel.ts';
import { generateCrackPattern }      from './generateCrackPattern.ts';

// ─── Función principal ─────────────────────────────────────────────────────

/**
 * Ejecuta la simulación completa del muro y retorna un resultado tipado.
 *
 * La función es pura: mismas entradas → mismo resultado.
 * No tiene efectos secundarios ni depende de estado global.
 *
 * @param dimensions  Dimensiones del muro (ancho, alto, espesor en metros).
 * @param material    Material con propiedades mecánicas del catálogo.
 * @param load        Carga aplicada (magnitud kN, dirección, peso propio).
 * @returns           WallSimulationResult completo, listo para UI y 3D.
 */
export function calculateWallResponse(
  dimensions: WallDimensions,
  material:   StructuralMaterial,
  load:       AppliedLoad,
): WallSimulationResult {
  const { widthM, thicknessM } = dimensions;
  const props = material.properties;

  // ── 1. Geometría base ─────────────────────────────────────────────────────
  const effectiveAreaM2 = Math.max(widthM * thicknessM, 1e-6);

  // ── 2. Factor de seguridad (módulo dedicado) ──────────────────────────────
  const fsResult = calculateSafetyFactor(dimensions, material, load);

  const {
    safetyFactor,
    utilizationRatio,
    actuatingStressMPa,
    totalLoadKN,
    selfWeightKN,
  } = fsResult;

  // ── 3. Esfuerzos internos simplificados ───────────────────────────────────
  //
  // ⚠️ Educativo: descomponemos el esfuerzo actuante en sus componentes
  // aproximados. En la realidad se necesitaría análisis de secciones y
  // diagramas de momento/cortante completos.
  //
  // compressiveMPa → esfuerzo axial principal (siempre presente)
  // tensileMPa     → tensión secundaria por excentricidad o flexión
  // shearMPa       → cortante estimado (relevante en carga LATERAL/COMBINED)
  // strainUnitless → deformación unitaria ε = σ/E

  const compressiveMPa = actuatingStressMPa;

  const tensileMPa =
    load.direction === 'OUT_OF_PLANE'
      ? actuatingStressMPa * 0.85  // Flexión fuera del plano → tensión dominante
      : actuatingStressMPa * 0.10; // Tensión secundaria siempre presente

  const shearMPa =
    load.direction === 'LATERAL' || load.direction === 'COMBINED'
      ? actuatingStressMPa * 0.60  // Cortante relevante en carga horizontal
      : actuatingStressMPa * 0.08;

  // ε = σ/E — E en GPa, σ en MPa → factor ×1000 para unidades consistentes
  const strainUnitless = compressiveMPa / (props.elasticModulusGPa * 1000);

  const stresses: WallStresses = {
    compressiveMPa,
    tensileMPa,
    shearMPa,
    strainUnitless,
  };

  // ── 4. Nivel de daño ──────────────────────────────────────────────────────
  const damageLevel = calculateDamageLevel(safetyFactor);

  // ── 5. Patrón de grietas ──────────────────────────────────────────────────
  const crackPattern = generateCrackPattern(damageLevel, load.direction, safetyFactor);

  // ── 6. Métricas auxiliares ────────────────────────────────────────────────
  //
  // Capacidad máxima teórica: P_max = f_c × A [kN]
  // Muestra cuánta carga total podría soportar el muro antes de fallar en compresión.
  const maxCapacityKN = props.compressiveStrengthMPa * effectiveAreaM2 * 1000;

  // ── 7. Mensaje de estado (para UI) ────────────────────────────────────────
  const { label, description } = getDamageLevelInfo(damageLevel);
  const statusMessage = `${label}: ${description}`;

  // ── Retorno del resultado completo (inmutable via readonly implicito) ──────
  return {
    dimensions,
    material,
    load,
    stresses,
    safetyFactor,
    utilizationRatio,
    damageLevel,
    crackPattern,
    maxCapacityKN,
    selfWeightKN,
    totalLoadKN,
    statusMessage,
  };
}

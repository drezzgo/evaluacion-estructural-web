/**
 * @file calculateSafetyFactor.ts
 * @description Motor educativo de cálculo del factor de seguridad (FS).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  SIMULACIÓN EDUCATIVA — APROXIMACIÓN SIMPLIFICADA
 *
 * Este módulo implementa mecánica de materiales elemental con fines
 * pedagógicos. Los resultados NO son válidos para diseño estructural,
 * peritajes, ni ningún uso profesional. Consulte siempre a un ingeniero
 * estructural certificado y la norma aplicable (NSR-10, ACI 318, etc.).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Modelo simplificado utilizado:
 *   área efectiva  = ancho × espesor                          (m²)
 *   esfuerzo       = carga_total / área_efectiva              (kN/m² → MPa)
 *   capacidad      = resistencia_material según dirección de carga (MPa)
 *   FS             = capacidad / esfuerzo
 *   utilización    = esfuerzo / capacidad  =  1 / FS
 */

import type { WallDimensions }      from '../domain/wall.types.ts';
import type { StructuralMaterial }  from '../domain/material.types.ts';
import type { AppliedLoad }         from '../domain/load.types.ts';

// ─── Constantes físicas ────────────────────────────────────────────────────

/** Aceleración gravitacional estándar (m/s²) */
const G = 9.807;

/** FS máximo devuelto cuando el esfuerzo es prácticamente cero (evita ∞) */
const FS_MAX = 99;

/** Umbral mínimo de esfuerzo en MPa para evitar división por cero */
const MIN_STRESS_MPA = 1e-6;

// ─── Interfaz de resultado ─────────────────────────────────────────────────

/** Resultado intermedio de calculateSafetyFactor — usado por el orquestador. */
export interface SafetyFactorResult {
  /** Factor de seguridad FS = capacidad / esfuerzo. Capéd en FS_MAX. */
  safetyFactor: number;

  /** Razón de utilización = esfuerzo / capacidad ∈ [0, ∞). >1 → falla. */
  utilizationRatio: number;

  /** Esfuerzo actuante calculado (MPa) */
  actuatingStressMPa: number;

  /** Capacidad de resistencia del material según dirección (MPa) */
  capacityMPa: number;

  /** Carga total considerada (kN), incluyendo peso propio si aplica */
  totalLoadKN: number;

  /** Peso propio del muro (kN) */
  selfWeightKN: number;
}

// ─── Función principal ─────────────────────────────────────────────────────

/**
 * Calcula el factor de seguridad y la razón de utilización del muro.
 *
 * Entradas seguras: si alguna dimensión o carga es ≤ 0, la función devuelve
 * FS_MAX con utilización 0 (muro sin esfuerzo) en lugar de romper la app.
 *
 * @param dimensions  Dimensiones físicas del muro en metros.
 * @param material    Material con propiedades mecánicas.
 * @param load        Carga aplicada (magnitud en kN + dirección).
 * @returns           SafetyFactorResult con todos los valores necesarios.
 */
export function calculateSafetyFactor(
  dimensions: WallDimensions,
  material:   StructuralMaterial,
  load:       AppliedLoad,
): SafetyFactorResult {
  const { widthM, heightM, thicknessM } = dimensions;
  const props = material.properties;

  // ── Guardia: valores inválidos devuelven muro "sin esfuerzo" ──────────────
  if (widthM <= 0 || heightM <= 0 || thicknessM <= 0 || load.magnitudeKN < 0) {
    return buildResult(FS_MAX, 0, 0, props.compressiveStrengthMPa, 0, 0);
  }

  // ── Geometría ─────────────────────────────────────────────────────────────
  //
  // Área efectiva transversal (plano horizontal):
  //   A_eff = ancho × espesor  [m²]
  //
  // Esta es el área que resiste la carga en compresión axial.
  // Para cortante se usa el área vertical (ancho × alto), pero mantenemos
  // la misma área efectiva para simplificar el modelo educativo.
  const effectiveAreaM2 = widthM * thicknessM;

  // ── Peso propio ───────────────────────────────────────────────────────────
  //   W = ρ × V × g / 1000   [kN]
  const volumeM3    = widthM * heightM * thicknessM;
  const selfWeightKN = (props.densityKgM3 * volumeM3 * G) / 1000;

  // ── Carga total ───────────────────────────────────────────────────────────
  const totalLoadKN = load.includeSelfWeight
    ? load.magnitudeKN + selfWeightKN
    : load.magnitudeKN;

  // ── Esfuerzo actuante ─────────────────────────────────────────────────────
  //   σ [kN/m²] = P [kN] / A [m²]
  //   σ [MPa]   = σ [kN/m²] / 1000
  //
  // ⚠️ Educativo: usamos la misma área efectiva para todas las direcciones
  // de carga. Un análisis real usaría secciones transversales distintas
  // según la dirección y el tipo de esfuerzo.
  const stressKNm2   = totalLoadKN / effectiveAreaM2;
  const stressMPa    = stressKNm2 / 1000;

  // ── Capacidad del material según dirección ────────────────────────────────
  const capacityMPa = selectCapacity(props, load.direction);

  // ── Factor de seguridad ───────────────────────────────────────────────────
  if (stressMPa < MIN_STRESS_MPA) {
    // Esfuerzo despreciable → muro en reposo sin carga significativa
    return buildResult(FS_MAX, 0, stressMPa, capacityMPa, totalLoadKN, selfWeightKN);
  }

  const fs              = capacityMPa / stressMPa;
  const utilizationRatio = stressMPa / capacityMPa;

  // Cap del FS para evitar valores absurdamente grandes
  const safeFactor = Math.min(fs, FS_MAX);

  return buildResult(safeFactor, utilizationRatio, stressMPa, capacityMPa, totalLoadKN, selfWeightKN);
}

// ─── Helpers privados ──────────────────────────────────────────────────────

/**
 * Selecciona la resistencia relevante del material según la dirección de carga.
 *
 * ⚠️ Educativo: en la realidad cada modo de falla tiene su propio modelo
 * de capacidad (por ejemplo, el cortante en mampostería depende de la
 * adherencia del mortero, no solo de la resistencia del bloque).
 */
function selectCapacity(
  props:     StructuralMaterial['properties'],
  direction: AppliedLoad['direction'],
): number {
  switch (direction) {
    case 'AXIAL':
      return props.compressiveStrengthMPa;

    case 'LATERAL':
      // Fuerza horizontal en el plano: gobierno de cortante
      return props.shearStrengthMPa;

    case 'OUT_OF_PLANE':
      // Presión perpendicular al muro: gobierno de tensión (flexión)
      // Los materiales pétreos son muy vulnerables a este modo
      return props.tensileStrengthMPa;

    case 'COMBINED':
      // Combinación simplificada: mínimo de compresión y cortante
      // ⚠️ Educativo: ignora la interacción biaxial real (diagrama P-M)
      return Math.min(props.compressiveStrengthMPa, props.shearStrengthMPa);

    default:
      return props.compressiveStrengthMPa;
  }
}

/** Construye el objeto de resultado sin lógica de negocio. */
function buildResult(
  safetyFactor:       number,
  utilizationRatio:   number,
  actuatingStressMPa: number,
  capacityMPa:        number,
  totalLoadKN:        number,
  selfWeightKN:       number,
): SafetyFactorResult {
  return {
    safetyFactor,
    utilizationRatio,
    actuatingStressMPa,
    capacityMPa,
    totalLoadKN,
    selfWeightKN,
  };
}

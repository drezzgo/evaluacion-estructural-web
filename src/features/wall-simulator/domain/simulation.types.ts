/**
 * @file simulation.types.ts
 * @description Tipos de dominio para los resultados del cálculo de simulación.
 *
 * ⚠️ AVISO EDUCATIVO: Los resultados de este simulador son aproximaciones
 * con fines didácticos basadas en mecánica de materiales elemental.
 * NO constituyen un análisis estructural profesional certificado.
 */

import type { WallDimensions, DamageLevel, CrackPattern } from './wall.types.ts';
import type { StructuralMaterial } from './material.types.ts';
import type { AppliedLoad } from './load.types.ts';

// ---------------------------------------------------------------------------
// Esfuerzos calculados
// ---------------------------------------------------------------------------

/**
 * Esfuerzos internos calculados en el muro.
 * Todos los valores están en MPa (megapascales).
 */
export interface WallStresses {
  /**
   * Esfuerzo de compresión actuante (σ).
   * Calculado como: σ = P / A (carga axial / área transversal).
   * Unidad: MPa
   */
  compressiveMPa: number;

  /**
   * Esfuerzo de tensión calculado (tracción).
   * Relevante cuando hay excentricidad de carga o cargas fuera del plano.
   * Unidad: MPa
   */
  tensileMPa: number;

  /**
   * Esfuerzo cortante actuante (τ).
   * Calculado como: τ = V / A_shear (fuerza lateral / área de cortante).
   * Unidad: MPa
   */
  shearMPa: number;

  /**
   * Deformación unitaria calculada (ε = σ / E).
   * Adimensional (mm/mm). Mide el acortamiento relativo del muro.
   */
  strainUnitless: number;
}

// ---------------------------------------------------------------------------
// Resultado completo de la simulación
// ---------------------------------------------------------------------------

/**
 * Resultado completo de una simulación de muro.
 * Generado por `calculateWallResponse` a partir de las entradas del usuario.
 */
export interface WallSimulationResult {
  // --- Entradas usadas (snapshotted para reproducibilidad) ---

  /** Dimensiones del muro que se usaron en esta simulación */
  dimensions: WallDimensions;

  /** Material seleccionado para esta simulación */
  material: StructuralMaterial;

  /** Carga aplicada en esta simulación */
  load: AppliedLoad;

  // --- Resultados calculados ---

  /** Esfuerzos internos calculados */
  stresses: WallStresses;

  /**
   * Factor de seguridad (FS) global simplificado.
   * FS = Resistencia / Esfuerzo_actuante.
   *
   * Interpretación educativa:
   *  - FS > 3.0 → Muro seguro (zona verde)
   *  - FS 2.0–3.0 → Aceptable con revisión
   *  - FS 1.0–2.0 → Crítico, posible daño
   *  - FS < 1.0 → Falla estructural
   */
  safetyFactor: number;

  /** Nivel de daño asignado basado en el factor de seguridad */
  damageLevel: DamageLevel;

  /**
   * Patrón de grietas generado para la visualización 3D.
   * Null si el nivel de daño es NONE.
   */
  crackPattern: CrackPattern | null;

  /**
   * Capacidad de carga máxima estimada del muro en kN.
   * Calculada como: P_max = Resistencia_material × Área_transversal.
   * Solo valor de referencia educativa.
   */
  maxCapacityKN: number;

  /**
   * Peso propio del muro en kN.
   * Calculado como: P_propio = Densidad × Volumen × g.
   */
  selfWeightKN: number;

  /**
   * Carga total efectiva considerada (incluyendo peso propio si aplica).
   * Unidad: kN
   */
  totalLoadKN: number;

  /**
   * Descripción textual del estado del muro para mostrar en la UI.
   * Generada automáticamente por el motor de simulación.
   */
  statusMessage: string;
}

/**
 * @file material.types.ts
 * @description Tipos de dominio para los materiales estructurales del muro.
 *
 * ⚠️ AVISO EDUCATIVO: Las propiedades aquí definidas son valores promedio
 * simplificados con fines didácticos. Los valores reales varían según
 * mezcla, curado, fabricación y normativa aplicable. No usar en diseño real.
 */

// ---------------------------------------------------------------------------
// Identificador del tipo de material
// ---------------------------------------------------------------------------

/**
 * Tipos de material disponibles en el simulador educativo.
 * Cada tipo representa un material constructivo común en muros.
 */
export type MaterialType =
  | 'CONCRETE'     // Concreto reforzado o simple
  | 'BRICK'        // Ladrillo cerámico / arcilla
  | 'MASONRY'      // Mampostería (ladrillo + mortero)
  | 'STEEL';       // Acero estructural (panel o placa)

// ---------------------------------------------------------------------------
// Propiedades mecánicas del material
// ---------------------------------------------------------------------------

/**
 * Propiedades mecánicas de un material estructural.
 * Todas las resistencias están en MPa (megapascales = N/mm²).
 * El módulo elástico está en GPa (gigapascales = kN/mm²).
 *
 * Referencia educativa:
 *   1 MPa ≈ 10.2 kgf/cm²
 *   1 GPa = 1000 MPa
 */
export interface MaterialProperties {
  /**
   * Resistencia a compresión (f'c o fc).
   * La capacidad más importante para muros verticales.
   * Unidad: MPa
   */
  compressiveStrengthMPa: number;

  /**
   * Resistencia a tensión (tracción).
   * Los muros de mampostería y concreto tienen baja resistencia a tensión.
   * Unidad: MPa
   */
  tensileStrengthMPa: number;

  /**
   * Resistencia a cortante.
   * Determina el comportamiento ante fuerzas laterales (p. ej. sismo).
   * Unidad: MPa
   */
  shearStrengthMPa: number;

  /**
   * Módulo de elasticidad (Young).
   * Mide la rigidez del material: cuán resistente es a deformarse.
   * Unidad: GPa
   */
  elasticModulusGPa: number;

  /**
   * Densidad del material.
   * Usada para estimar el peso propio del muro.
   * Unidad: kg/m³
   */
  densityKgM3: number;

  /**
   * Deformación unitaria de rotura (fractura).
   * Expresada como fracción (ej. 0.003 = 3 mm/m).
   * Indica cuánto se puede deformar antes de fallar.
   */
  ultimateStrain: number;
}

// ---------------------------------------------------------------------------
// Material estructural
// ---------------------------------------------------------------------------

/**
 * Representa un material estructural completo con su metadata educativa.
 */
export interface StructuralMaterial {
  /** Identificador único del material */
  id: MaterialType;

  /** Nombre legible para la UI */
  displayName: string;

  /** Descripción educativa del material */
  description: string;

  /** Propiedades mecánicas del material */
  properties: MaterialProperties;

  /**
   * Color hexadecimal representativo para el render 3D.
   * Solo para visualización pedagógica.
   */
  colorHex: string;

  /**
   * Rugosidad de la superficie (0 = perfectamente lisa, 1 = muy rugosa).
   * Para el motor de rendering PBR en Three.js.
   */
  roughness: number;

  /**
   * Nivel de metalicidad (0 = no metálico, 1 = completamente metálico).
   * Para el motor de rendering PBR en Three.js.
   */
  metalness: number;
}

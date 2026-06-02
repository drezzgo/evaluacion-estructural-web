/**
 * @file materials.catalog.ts
 * @description Catálogo de materiales estructurales predefinidos para el simulador.
 *
 * ⚠️ AVISO EDUCATIVO: Los valores de resistencia y rigidez aquí listados
 * son rangos promedios simplificados para uso pedagógico. NO representan
 * una especificación técnica ni deben usarse en el diseño de estructuras
 * reales. Consulte la norma NSR-10, ACI 318, ASTM u otras aplicables.
 *
 * Fuentes de referencia académica (simplificadas):
 *   - McCormac & Brown, "Design of Reinforced Concrete", 8th Ed.
 *   - Nilson, Darwin & Dolan, "Design of Concrete Structures", 14th Ed.
 *   - Gallegos & Casabonne, "Albañilería Estructural", 3ra Ed.
 */

import type { StructuralMaterial } from '../domain/material.types.ts';

// ---------------------------------------------------------------------------
// Catálogo principal de materiales
// ---------------------------------------------------------------------------

/**
 * Registro de todos los materiales disponibles en el simulador educativo.
 * Indexado por MaterialType para acceso O(1).
 */
export const MATERIALS_CATALOG: Record<string, StructuralMaterial> = {
  // -------------------------------------------------------------------------
  // Concreto simple (sin refuerzo — valor representativo f'c 21 MPa)
  // -------------------------------------------------------------------------
  CONCRETE: {
    id: 'CONCRETE',
    displayName: 'Concreto',
    description:
      'Material pétreo artificial de alta resistencia a compresión. ' +
      'Resistencia típica f\'c = 21 MPa (3000 PSI). Frágil a tensión. ' +
      'Muy usado en muros de carga, columnas y losas.',
    properties: {
      compressiveStrengthMPa: 21,   // f'c = 21 MPa (3000 PSI) — común en vivienda
      tensileStrengthMPa: 2.1,      // ≈ 10% de la resistencia a compresión
      shearStrengthMPa: 3.5,        // ≈ 0.17 × √f'c (MPa), simplificado
      elasticModulusGPa: 22,        // Ec ≈ 4700 × √f'c (MPa) → ~21.5 GPa
      densityKgM3: 2400,            // Concreto normal: 2300–2500 kg/m³
      ultimateStrain: 0.003,        // εu ≈ 0.003 según ACI 318 (educativo)
    },
    colorHex: '#64748B',  // Gris pizarra
    roughness: 0.9,
    metalness: 0.0,
  },

  // -------------------------------------------------------------------------
  // Ladrillo macizo de arcilla (unidad sola, sin mortero)
  // -------------------------------------------------------------------------
  BRICK: {
    id: 'BRICK',
    displayName: 'Ladrillo',
    description:
      'Unidad de arcilla cocida, muy común en construcción informal y ' +
      'tradicional. Resistencia variable según cocción y mezcla. ' +
      'Resistencia típica a compresión: 10–15 MPa en unidades de buena calidad.',
    properties: {
      compressiveStrengthMPa: 12,   // Resistencia media de ladrillo artesanal
      tensileStrengthMPa: 1.0,      // Muy baja — ladrillo es frágil a tracción
      shearStrengthMPa: 1.5,        // Fallo en juntas o en la unidad
      elasticModulusGPa: 7,         // Más deformable que el concreto
      densityKgM3: 1800,            // Ladrillo macizo: 1700–1900 kg/m³
      ultimateStrain: 0.004,        // Mayor deformabilidad que concreto
    },
    colorHex: '#D97706',  // Terracota / ámbar oscuro
    roughness: 0.95,
    metalness: 0.0,
  },

  // -------------------------------------------------------------------------
  // Mampostería confinada (ladrillo + mortero — sistema compuesto)
  // -------------------------------------------------------------------------
  MASONRY: {
    id: 'MASONRY',
    displayName: 'Mampostería',
    description:
      'Sistema compuesto de unidades de arcilla o bloque de concreto ' +
      'unidas con mortero de cemento-arena. Incluye juntas que son el ' +
      'punto más débil. Resistencia típica del sistema: 6–10 MPa.',
    properties: {
      compressiveStrengthMPa: 8,    // f'm típico en mampostería confinada
      tensileStrengthMPa: 0.5,      // Muy baja — depende del mortero
      shearStrengthMPa: 0.8,        // Fallo por deslizamiento en juntas
      elasticModulusGPa: 5,         // Em ≈ 500 × f'm (MPa), aprox.
      densityKgM3: 1900,            // Sistema mixto: ladrillo + mortero + juntas
      ultimateStrain: 0.005,        // Mayor deformación acumulada en juntas
    },
    colorHex: '#D4D4D8',  // Arena / Beige grisáceo
    roughness: 0.98,
    metalness: 0.0,
  },

  // -------------------------------------------------------------------------
  // Acero estructural (panel o placa — ASTM A36 representativo)
  // -------------------------------------------------------------------------
  STEEL: {
    id: 'STEEL',
    displayName: 'Acero',
    description:
      'Material metálico de alta resistencia tanto a compresión como a ' +
      'tensión (material isotrópico). Acero A36: Fy = 250 MPa. ' +
      'Muy usado en estructuras industriales, paneles y muros cortina.',
    properties: {
      compressiveStrengthMPa: 250,  // Fy = 250 MPa (A36) — límite elástico
      tensileStrengthMPa: 400,      // Fu = 400 MPa (A36) — resistencia última
      shearStrengthMPa: 145,        // Fv ≈ 0.6 × Fy (criterio de Von Mises)
      elasticModulusGPa: 200,       // E = 200 GPa (constante para acero)
      densityKgM3: 7850,            // Acero estructural: 7800–7900 kg/m³
      ultimateStrain: 0.20,         // Alta ductilidad: 15–25% elongación
    },
    colorHex: '#0EA5E9',  // Azul acero
    roughness: 0.3,
    metalness: 0.9,
  },
};

// ---------------------------------------------------------------------------
// Helpers de acceso
// ---------------------------------------------------------------------------

/**
 * Retorna el listado de materiales como array ordenado para poblar
 * selectores en la UI.
 */
export function getMaterialsList(): StructuralMaterial[] {
  return Object.values(MATERIALS_CATALOG);
}

/**
 * Recupera un material del catálogo por su ID.
 * Lanza un error si el ID no existe (fail-fast para errores de configuración).
 */
export function getMaterialById(id: string): StructuralMaterial {
  const material = MATERIALS_CATALOG[id];
  if (!material) {
    throw new Error(
      `[wall-simulator] Material con ID "${id}" no encontrado en el catálogo.`
    );
  }
  return material;
}

/**
 * Material por defecto que se carga al inicializar el simulador.
 */
export const DEFAULT_MATERIAL: StructuralMaterial = MATERIALS_CATALOG['CONCRETE']!;

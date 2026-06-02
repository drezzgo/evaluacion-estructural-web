/**
 * @file wallSimulator.store.ts
 * @description Estado global del simulador de fallas en muros usando Zustand.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Arquitectura del estado:
 *
 *   ┌─────────────────────────────────────────────┐
 *   │  INPUTS (controlados por el usuario)        │
 *   │   dimensions → setDimensions()              │
 *   │   materialId → setMaterial()                │
 *   │   load       → setLoad()                    │
 *   └──────────────────┬──────────────────────────┘
 *                      │ cada cambio dispara
 *                      ▼
 *   ┌─────────────────────────────────────────────┐
 *   │  recalculate()  — motor de simulación       │
 *   │   calculateWallResponse(dims, mat, load)    │
 *   └──────────────────┬──────────────────────────┘
 *                      │ produce
 *                      ▼
 *   ┌─────────────────────────────────────────────┐
 *   │  RESULT (solo lectura para la UI/3D)        │
 *   │   simulationResult: WallSimulationResult    │
 *   └─────────────────────────────────────────────┘
 *
 * Reglas del store:
 *   - Sin lógica visual (no Three.js, no CSS).
 *   - Sin efectos secundarios fuera de Zustand.
 *   - Siempre hay un resultado válido (nunca null en estado normal).
 *   - La simulación se recalcula síncronamente en cada cambio de input.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { create }                    from 'zustand';
import type { WallDimensions }       from '../domain/wall.types.ts';
import type { MaterialType }         from '../domain/material.types.ts';
import type { AppliedLoad, LoadDirection } from '../domain/load.types.ts';
import type { WallSimulationResult } from '../domain/simulation.types.ts';
import { calculateWallResponse }     from '../simulation/calculateWallResponse.ts';
import type { CrackPatternType, WallFragment } from '../domain/wall.types.ts';
import { generateWallFragments }     from '../simulation/generateWallFragments.ts';
import { evaluateWallFragments, findCriticalFragment } from '../simulation/evaluateWallFragments.ts';
import { getMaterialById }           from '../data/materials.catalog.ts';

// ─── Valores iniciales ─────────────────────────────────────────────────────
//
// Representan un muro típico de vivienda colombiana:
// 3 m ancho × 2.5 m alto × 0.15 m espesor, concreto, carga axial ligera.

const INITIAL_DIMENSIONS: WallDimensions = {
  widthM:     3.0,   // metros
  heightM:    2.5,   // metros
  thicknessM: 0.15,  // metros (15 cm — muro estructural delgado)
};

const INITIAL_MATERIAL_ID: MaterialType = 'CONCRETE';

const INITIAL_LOAD: AppliedLoad = {
  magnitudeKN:    50,       // 50 kN — carga de losa ligera sobre el muro
  direction:      'AXIAL',  // Compresión vertical
  positionXNorm:  0.5,      // Centro horizontal
  positionYNorm:  1.0,      // Aplicada en la corona del muro
  includeSelfWeight: true,  // Incluir peso propio del muro
};

const INITIAL_CRACK_PATTERN: CrackPatternType = 'healthy';

// ─── Tipos del store ───────────────────────────────────────────────────────

/**
 * Estado completo del simulador.
 * Separado en INPUTS (mutables) y RESULT (derivado de los inputs).
 */
export interface WallSimulatorState {
  // ── Inputs del usuario ───────────────────────────────────────────────────

  /** Dimensiones físicas del muro en metros. */
  dimensions: WallDimensions;

  /**
   * ID del material actualmente seleccionado.
   * Usar ID en lugar del objeto completo permite serialización simple
   * y facilita la persistencia futura (localStorage, URL params).
   */
  materialId: MaterialType;

  /** Carga estructural aplicada al muro. */
  load: AppliedLoad;

  /** Tipo de patrón de grieta predefinido seleccionado. */
  selectedCrackPatternType: CrackPatternType;

  // ── Resultado derivado (solo lectura para UI y 3D) ───────────────────────

  /**
   * Resultado completo de la última simulación.
   */
  simulationResult: WallSimulationResult;

  /** Fragmentos del muro evaluados individualmente. */
  fragments: WallFragment[];

  /** El fragmento con el menor factor de seguridad. */
  criticalFragment: WallFragment | null;

  // ── Acciones ─────────────────────────────────────────────────────────────

  /**
   * Actualiza las dimensiones del muro y recalcula la simulación.
   * Permite actualización parcial: solo los campos que cambien.
   */
  setDimensions: (partial: Partial<WallDimensions>) => void;

  /**
   * Cambia el material seleccionado y recalcula la simulación.
   * @param id — clave del catálogo: 'CONCRETE' | 'BRICK' | 'MASONRY' | 'STEEL'
   */
  setMaterial: (id: MaterialType) => void;

  /**
   * Actualiza la carga aplicada y recalcula la simulación.
   * Permite actualización parcial: solo los campos que cambien.
   */
  setLoad: (partial: Partial<AppliedLoad>) => void;

  /**
   * Cambia solo la dirección de la carga y recalcula.
   * Atajo conveniente para el selector de dirección en la UI.
   */
  setLoadDirection: (direction: LoadDirection) => void;

  /**
   * Cambia el patrón de grietas y recalcula la fragmentación.
   */
  setCrackPatternType: (type: CrackPatternType) => void;

  /**
   * Fuerza un recálculo completo con el estado actual de inputs.
   * Útil si el catálogo de materiales cambia en runtime (extensibilidad futura).
   */
  recalculate: () => void;

  /**
   * Restaura todos los inputs a sus valores iniciales y recalcula.
   * No borra el historial — solo reinicia el estado de la simulación.
   */
  resetSimulation: () => void;
}

// ─── Helper: ejecutar la simulación con el estado actual ──────────────────

/**
 * Resuelve el material del catálogo y ejecuta calculateWallResponse.
 * Centraliza la lógica de "obtener material + calcular" en un solo lugar.
 *
 * Si el materialId no existe en el catálogo (error de configuración),
 * lanza un error descriptivo en lugar de fallar silenciosamente.
 */
function runSimulation(
  dimensions: WallDimensions,
  materialId: MaterialType,
  load:       AppliedLoad,
  patternType: CrackPatternType,
): { simulationResult: WallSimulationResult; fragments: WallFragment[]; criticalFragment: WallFragment | null } {
  const material = getMaterialById(materialId);
  const simulationResult = calculateWallResponse(dimensions, material, load);
  
  const rawFragments = generateWallFragments(dimensions, patternType);
  const evaluatedFragments = evaluateWallFragments(rawFragments, load, material, dimensions.widthM);
  const finalFragments = findCriticalFragment(evaluatedFragments);
  const criticalFragment = finalFragments.find(f => f.isCritical) || null;

  return { simulationResult, fragments: finalFragments, criticalFragment };
}

// ─── Creación del store ────────────────────────────────────────────────────

/**
 * Store de Zustand del simulador de muros.
 *
 * @example
 * ```tsx
 * // En cualquier componente React:
 * const { dimensions, setDimensions, simulationResult } = useWallSimulatorStore();
 *
 * // Para leer solo el resultado (evita re-renders por cambios en inputs):
 * const result = useWallSimulatorStore(s => s.simulationResult);
 * ```
 */
export const useWallSimulatorStore = create<WallSimulatorState>((set, get) => {
  // Calcular el resultado inicial al crear el store
  const { simulationResult, fragments, criticalFragment } = runSimulation(
    INITIAL_DIMENSIONS,
    INITIAL_MATERIAL_ID,
    INITIAL_LOAD,
    INITIAL_CRACK_PATTERN
  );

  return {
    // ── Estado inicial ──────────────────────────────────────────────────────
    dimensions:               INITIAL_DIMENSIONS,
    materialId:               INITIAL_MATERIAL_ID,
    load:                     INITIAL_LOAD,
    selectedCrackPatternType: INITIAL_CRACK_PATTERN,
    simulationResult,
    fragments,
    criticalFragment,

    // ── setDimensions ───────────────────────────────────────────────────────
    setDimensions: (partial) => {
      set((state) => {
        const nextDimensions: WallDimensions = {
          ...state.dimensions,
          ...partial,
        };
        const updates = runSimulation(nextDimensions, state.materialId, state.load, state.selectedCrackPatternType);
        return {
          dimensions: nextDimensions,
          ...updates,
        };
      });
    },

    // ── setMaterial ─────────────────────────────────────────────────────────
    setMaterial: (id) => {
      set((state) => {
        const updates = runSimulation(state.dimensions, id, state.load, state.selectedCrackPatternType);
        return {
          materialId: id,
          ...updates,
        };
      });
    },

    // ── setLoad ─────────────────────────────────────────────────────────────
    setLoad: (partial) => {
      set((state) => {
        const nextLoad: AppliedLoad = {
          ...state.load,
          ...partial,
        };
        const updates = runSimulation(state.dimensions, state.materialId, nextLoad, state.selectedCrackPatternType);
        return {
          load: nextLoad,
          ...updates,
        };
      });
    },

    // ── setLoadDirection ────────────────────────────────────────────────────
    setLoadDirection: (direction) => {
      set((state) => {
        const nextLoad: AppliedLoad = { ...state.load, direction };
        const updates = runSimulation(state.dimensions, state.materialId, nextLoad, state.selectedCrackPatternType);
        return {
          load: nextLoad,
          ...updates,
        };
      });
    },

    // ── setCrackPatternType ─────────────────────────────────────────────────
    setCrackPatternType: (type) => {
      set((state) => {
        const updates = runSimulation(state.dimensions, state.materialId, state.load, type);
        return {
          selectedCrackPatternType: type,
          ...updates,
        };
      });
    },

    // ── recalculate ─────────────────────────────────────────────────────────
    recalculate: () => {
      const { dimensions, materialId, load, selectedCrackPatternType } = get();
      set({ ...runSimulation(dimensions, materialId, load, selectedCrackPatternType) });
    },

    // ── resetSimulation ─────────────────────────────────────────────────────
    resetSimulation: () => {
      set({
        dimensions:               INITIAL_DIMENSIONS,
        materialId:               INITIAL_MATERIAL_ID,
        load:                     INITIAL_LOAD,
        selectedCrackPatternType: INITIAL_CRACK_PATTERN,
        ...runSimulation(
          INITIAL_DIMENSIONS,
          INITIAL_MATERIAL_ID,
          INITIAL_LOAD,
          INITIAL_CRACK_PATTERN
        ),
      });
    },
  };
});

// ─── Selectores reutilizables (evitan re-renders innecesarios) ─────────────
//
// Pasa uno de estos como argumento a useWallSimulatorStore() para suscribirte
// solo a la parte del estado que necesitas. El componente solo re-renderiza
// cuando esa parte específica cambia.
//
// @example
//   const safetyFactor = useWallSimulatorStore(selectSafetyFactor);

/** Selector: dimensiones actuales del muro. */
export const selectDimensions =
  (s: WallSimulatorState) => s.dimensions;

/** Selector: ID del material actualmente seleccionado. */
export const selectMaterialId =
  (s: WallSimulatorState) => s.materialId;

/** Selector: carga aplicada actual. */
export const selectLoad =
  (s: WallSimulatorState) => s.load;

/** Selector: resultado completo de la simulación (fuente de verdad para UI/3D). */
export const selectSimulationResult =
  (s: WallSimulatorState) => s.simulationResult;

/** Selector: solo el factor de seguridad (para gráficos de métrica). */
export const selectSafetyFactor =
  (s: WallSimulatorState) => s.simulationResult.safetyFactor;

/** Selector: razón de utilización (para el color del muro 3D). */
export const selectUtilizationRatio =
  (s: WallSimulatorState) => s.simulationResult.utilizationRatio;

/** Selector: nivel de daño (para gráficos y textos de estado). */
export const selectDamageLevel =
  (s: WallSimulatorState) => s.simulationResult.damageLevel;

/** Selector: patrón de grietas (para el motor de rendering 3D). */
export const selectCrackPattern =
  (s: WallSimulatorState) => s.simulationResult.crackPattern;

/** Selector: patrón de grietas seleccionado por el usuario. */
export const selectCrackPatternType =
  (s: WallSimulatorState) => s.selectedCrackPatternType;

/** Selector: fragmentos generados tras la simulación. */
export const selectFragments =
  (s: WallSimulatorState) => s.fragments;

/** Selector: fragmento crítico calculado. */
export const selectCriticalFragment =
  (s: WallSimulatorState) => s.criticalFragment;

/** Selector: esfuerzos internos (para el gráfico de Recharts). */
export const selectStresses =
  (s: WallSimulatorState) => s.simulationResult.stresses;

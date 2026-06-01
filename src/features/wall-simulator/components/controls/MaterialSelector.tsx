/**
 * MaterialSelector.tsx
 * Selector de material estructural con visualización de propiedades clave.
 * Conectado al store de Zustand.
 */

import { useWallSimulatorStore, selectMaterialId } from '../../state/wallSimulator.store.ts';
import { getMaterialsList }                        from '../../data/materials.catalog.ts';
import { SidebarSection }                          from '../layout/SidebarPanel.tsx';
import type { MaterialType }                       from '../../domain/material.types.ts';

const MATERIALS = getMaterialsList();

export function MaterialSelector() {
  const materialId = useWallSimulatorStore(selectMaterialId);
  const setMaterial = useWallSimulatorStore((s) => s.setMaterial);

  const current = MATERIALS.find((m) => m.id === materialId)!;

  return (
    <SidebarSection title="Material" icon="🧱">
      {/* Grid de tarjetas de material */}
      <div className="grid grid-cols-2 gap-1.5">
        {MATERIALS.map((mat) => {
          const isSelected = mat.id === materialId;
          return (
            <button
              key={mat.id}
              onClick={() => setMaterial(mat.id as MaterialType)}
              className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-left
                transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'border-[#126DA6] bg-[#126DA6]/15 shadow-[0_0_0_1px_rgba(18,109,166,0.4)]'
                  : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                }`}
            >
              {/* Chip de color del material */}
              <div
                className="w-5 h-5 rounded-sm"
                style={{ backgroundColor: mat.colorHex }}
              />
              <span
                className="text-xs font-semibold leading-tight"
                style={{
                  color:      isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  fontFamily: "'Cal Sans', Inter, sans-serif",
                }}
              >
                {mat.displayName}
              </span>
              <span className="text-[9px] font-mono text-white/30 tabular-nums">
                f'c {mat.properties.compressiveStrengthMPa} MPa
              </span>
            </button>
          );
        })}
      </div>

      {/* Propiedades del material seleccionado */}
      {current && (
        <div className="mt-1 p-2.5 rounded-md bg-white/5 border border-white/8 space-y-1.5">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold"
            style={{ fontFamily: "Inter, sans-serif" }}>
            Propiedades ({current.displayName})
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono">
            {[
              ['Compresión', `${current.properties.compressiveStrengthMPa} MPa`],
              ['Tensión', `${current.properties.tensileStrengthMPa} MPa`],
              ['Cortante', `${current.properties.shearStrengthMPa} MPa`],
              ['Módulo E', `${current.properties.elasticModulusGPa} GPa`],
              ['Densidad', `${current.properties.densityKgM3} kg/m³`],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-white/35">{k}</span>
                <span className="text-[#3ab7bf] text-right">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-white/20 pt-0.5 leading-relaxed">
            {current.description.slice(0, 80)}…
          </p>
        </div>
      )}
    </SidebarSection>
  );
}

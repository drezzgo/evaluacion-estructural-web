/**
 * MaterialSelector.tsx
 * Selector de material estructural en tema claro.
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
    <SidebarSection title="Material Estructural" icon="🧱" defaultOpen={false}>
      {/* Grid de tarjetas de material */}
      <div className="grid grid-cols-2 gap-2">
        {MATERIALS.map((mat) => {
          const isSelected = mat.id === materialId;
          return (
            <button
              key={mat.id}
              onClick={() => setMaterial(mat.id as MaterialType)}
              className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left
                transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-ea-blue bg-white shadow-[0_0_0_1px_rgba(18,109,166,1),0_4px_12px_rgba(18,109,166,0.1)]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              {/* Chip de color del material */}
              <div
                className="w-5 h-5 rounded shadow-sm border border-black/5"
                style={{ backgroundColor: mat.colorHex }}
              />
              <span
                className="text-sm font-semibold leading-tight mt-1"
                style={{
                  color:      isSelected ? '#126DA6' : '#242424',
                  fontFamily: "'Cal Sans', Inter, sans-serif",
                }}
              >
                {mat.displayName}
              </span>
              <span className="text-[10px] font-mono font-medium text-gray-500 tabular-nums">
                f'c {mat.properties.compressiveStrengthMPa} MPa
              </span>
            </button>
          );
        })}
      </div>

      {/* Propiedades del material seleccionado */}
      {current && (
        <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold"
            style={{ fontFamily: "Inter, sans-serif" }}>
            Ficha Técnica ({current.displayName})
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[12px] font-mono">
            {[
              ['Compresión', `${current.properties.compressiveStrengthMPa} MPa`],
              ['Tensión', `${current.properties.tensileStrengthMPa} MPa`],
              ['Cortante', `${current.properties.shearStrengthMPa} MPa`],
              ['Módulo E', `${current.properties.elasticModulusGPa} GPa`],
              ['Densidad', `${current.properties.densityKgM3} kg/m³`],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-gray-500 font-medium">{k}</span>
                <span className="text-brand-midnight text-right font-bold">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 mt-2 leading-relaxed">
            {current.description}
          </p>
        </div>
      )}
    </SidebarSection>
  );
}

/**
 * LoadControls.tsx
 * Controles de carga aplicada en tema claro.
 */

import { useWallSimulatorStore, selectLoad } from '../../state/wallSimulator.store.ts';
import { SidebarSection, LabeledSlider }     from '../layout/SidebarPanel.tsx';
import type { LoadDirection }                from '../../domain/load.types.ts';

const DIRECTIONS: { id: LoadDirection; label: string; icon: string; desc: string }[] = [
  { id: 'AXIAL',        label: 'Axial',         icon: '⬇', desc: 'Vertical' },
  { id: 'LATERAL',      label: 'Lateral',        icon: '➡', desc: 'Sísmico' },
  { id: 'OUT_OF_PLANE', label: 'Fuera plano',    icon: '↗', desc: 'Viento' },
  { id: 'COMBINED',     label: 'Combinada',      icon: '✕', desc: 'Ax+Lat' },
];

export function LoadControls() {
  const load           = useWallSimulatorStore(selectLoad);
  const setLoad        = useWallSimulatorStore((s) => s.setLoad);
  const setLoadDir     = useWallSimulatorStore((s) => s.setLoadDirection);
  const resetSimulation = useWallSimulatorStore((s) => s.resetSimulation);

  return (
    <SidebarSection title="Estado de Cargas" icon="⚡">

      <LabeledSlider
        label="Magnitud"
        value={load.magnitudeKN}
        min={0}
        max={5000}
        step={10}
        unit=" kN"
        onChange={(v) => setLoad({ magnitudeKN: v })}
      />

      <div className="space-y-2 pt-2">
        <p className="text-[13px] font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
          Dirección de la Carga
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DIRECTIONS.map((dir) => {
            const isActive = load.direction === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => setLoadDir(dir.id)}
                title={dir.desc}
                className={`flex flex-col items-start gap-1 p-2.5 rounded-xl text-left
                  transition-all duration-200 cursor-pointer border
                  ${isActive
                    ? 'bg-ea-blue/5 border-ea-blue text-brand-midnight shadow-[0_0_0_1px_rgba(18,109,166,1)]'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:shadow-sm hover:text-brand-charcoal'
                  }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-base leading-none text-brand-charcoal">{dir.icon}</span>
                  <span style={{ fontFamily: "Inter, sans-serif" }} className="font-semibold text-sm leading-tight">
                    {dir.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-1">{dir.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <LabeledSlider
          label="Excentricidad (Posición X)"
          value={load.positionXNorm}
          min={0}
          max={1}
          step={0.05}
          unit=""
          onChange={(v) => setLoad({ positionXNorm: v })}
        />
      </div>

      <div className="flex items-center justify-between py-3 border-y border-gray-100 my-2">
        <span className="text-[13px] font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
          Incluir peso propio (Dead Load)
        </span>
        <button
          role="switch"
          aria-checked={load.includeSelfWeight}
          onClick={() => setLoad({ includeSelfWeight: !load.includeSelfWeight })}
          className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer border-2
            ${load.includeSelfWeight
              ? 'bg-ea-blue border-ea-blue'
              : 'bg-gray-200 border-gray-200'
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${load.includeSelfWeight ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <button
        onClick={resetSimulation}
        className="w-full mt-4 py-2.5 text-sm font-semibold text-gray-600 bg-white
          border border-gray-200 rounded-full hover:border-gray-300 hover:text-brand-charcoal hover:bg-gray-50
          transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        ↺ Restablecer valores
      </button>
    </SidebarSection>
  );
}

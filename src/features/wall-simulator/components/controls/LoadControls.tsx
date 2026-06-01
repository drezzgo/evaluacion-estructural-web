/**
 * LoadControls.tsx
 * Controles de carga aplicada: magnitud, dirección y peso propio.
 * Conectado al store de Zustand.
 */

import { useWallSimulatorStore, selectLoad } from '../../state/wallSimulator.store.ts';
import { SidebarSection, LabeledSlider }     from '../layout/SidebarPanel.tsx';
import type { LoadDirection }                from '../../domain/load.types.ts';

// ─── Opciones de dirección ─────────────────────────────────────────────────

const DIRECTIONS: { id: LoadDirection; label: string; icon: string; desc: string }[] = [
  { id: 'AXIAL',        label: 'Axial',         icon: '⬇', desc: 'Compresión vertical' },
  { id: 'LATERAL',      label: 'Lateral',        icon: '➡', desc: 'Cortante sísmico' },
  { id: 'OUT_OF_PLANE', label: 'Fuera del plano',icon: '↗', desc: 'Presión de viento' },
  { id: 'COMBINED',     label: 'Combinada',      icon: '✕', desc: 'Axial + lateral' },
];

export function LoadControls() {
  const load           = useWallSimulatorStore(selectLoad);
  const setLoad        = useWallSimulatorStore((s) => s.setLoad);
  const setLoadDir     = useWallSimulatorStore((s) => s.setLoadDirection);
  const resetSimulation = useWallSimulatorStore((s) => s.resetSimulation);

  return (
    <SidebarSection title="Carga Aplicada" icon="⚡">

      {/* Magnitud */}
      <LabeledSlider
        label="Magnitud"
        value={load.magnitudeKN}
        min={0}
        max={5000}
        step={10}
        unit=" kN"
        onChange={(v) => setLoad({ magnitudeKN: v })}
      />

      {/* Dirección de la carga */}
      <div className="space-y-1.5">
        <p className="text-xs text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>
          Dirección
        </p>
        <div className="grid grid-cols-2 gap-1">
          {DIRECTIONS.map((dir) => {
            const isActive = load.direction === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => setLoadDir(dir.id)}
                title={dir.desc}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-left
                  transition-all duration-150 cursor-pointer text-xs border
                  ${isActive
                    ? 'bg-[#126DA6]/20 border-[#126DA6]/50 text-white'
                    : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                  }`}
              >
                <span className="text-sm leading-none">{dir.icon}</span>
                <span style={{ fontFamily: "Inter, sans-serif" }} className="font-medium leading-tight">
                  {dir.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-white/25 font-mono">
          {DIRECTIONS.find(d => d.id === load.direction)?.desc}
        </p>
      </div>

      {/* Punto de aplicación horizontal */}
      <LabeledSlider
        label="Posición horizontal"
        value={load.positionXNorm}
        min={0}
        max={1}
        step={0.05}
        unit=""
        onChange={(v) => setLoad({ positionXNorm: v })}
      />

      {/* Toggle peso propio */}
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
          Incluir peso propio
        </span>
        <button
          role="switch"
          aria-checked={load.includeSelfWeight}
          onClick={() => setLoad({ includeSelfWeight: !load.includeSelfWeight })}
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer border
            ${load.includeSelfWeight
              ? 'bg-[#126DA6] border-[#126DA6]'
              : 'bg-white/10 border-white/20'
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${load.includeSelfWeight ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Botón de reset */}
      <button
        onClick={resetSimulation}
        className="w-full mt-1 py-2 text-xs font-semibold text-white/40
          border border-white/10 rounded-lg hover:border-white/20 hover:text-white/60
          transition-all duration-150 cursor-pointer"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        ↺ Restablecer simulación
      </button>
    </SidebarSection>
  );
}

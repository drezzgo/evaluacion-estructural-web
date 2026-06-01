/**
 * WallDimensionsForm.tsx
 * Controles de dimensiones del muro: ancho, alto y espesor.
 * Conectado al store de Zustand — cada cambio recalcula la simulación.
 */

import { useWallSimulatorStore, selectDimensions } from '../../state/wallSimulator.store.ts';
import { SidebarSection, LabeledSlider }           from '../layout/SidebarPanel.tsx';

export function WallDimensionsForm() {
  const dimensions    = useWallSimulatorStore(selectDimensions);
  const setDimensions = useWallSimulatorStore((s) => s.setDimensions);

  return (
    <SidebarSection title="Dimensiones del Muro" icon="📐">
      <LabeledSlider
        label="Ancho"
        value={dimensions.widthM}
        min={0.5}
        max={10}
        step={0.1}
        unit=" m"
        onChange={(v) => setDimensions({ widthM: v })}
      />
      <LabeledSlider
        label="Altura"
        value={dimensions.heightM}
        min={0.5}
        max={6}
        step={0.1}
        unit=" m"
        onChange={(v) => setDimensions({ heightM: v })}
      />
      <LabeledSlider
        label="Espesor"
        value={dimensions.thicknessM}
        min={0.08}
        max={0.60}
        step={0.01}
        unit=" m"
        onChange={(v) => setDimensions({ thicknessM: v })}
      />

      {/* Resumen de geometría */}
      <div className="mt-1 p-2.5 rounded-md bg-white/5 border border-white/8">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-semibold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Geometría
        </p>
        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
          <span className="text-white/40">Área efectiva</span>
          <span className="text-[#3ab7bf] text-right">
            {(dimensions.widthM * dimensions.thicknessM).toFixed(3)} m²
          </span>
          <span className="text-white/40">Volumen</span>
          <span className="text-[#3ab7bf] text-right">
            {(dimensions.widthM * dimensions.heightM * dimensions.thicknessM).toFixed(3)} m³
          </span>
        </div>
      </div>
    </SidebarSection>
  );
}

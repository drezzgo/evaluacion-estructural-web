/**
 * WallDimensionsForm.tsx
 * Controles de dimensiones del muro en tema claro corporativo.
 */

import { useWallSimulatorStore, selectDimensions } from '../../state/wallSimulator.store.ts';
import { SidebarSection, LabeledSlider }           from '../layout/SidebarPanel.tsx';

export function WallDimensionsForm() {
  const dimensions    = useWallSimulatorStore(selectDimensions);
  const setDimensions = useWallSimulatorStore((s) => s.setDimensions);

  return (
    <SidebarSection title="Geometría del Muro" icon="📐">
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
      <div className="mt-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Datos Geométricos
        </p>
        <div className="grid grid-cols-2 gap-2 text-[12px] font-mono">
          <span className="text-gray-500 font-medium">Área efectiva</span>
          <span className="text-brand-midnight text-right font-bold">
            {(dimensions.widthM * dimensions.thicknessM).toFixed(3)} m²
          </span>
          <span className="text-gray-500 font-medium">Volumen</span>
          <span className="text-brand-midnight text-right font-bold">
            {(dimensions.widthM * dimensions.heightM * dimensions.thicknessM).toFixed(3)} m³
          </span>
        </div>
      </div>
    </SidebarSection>
  );
}

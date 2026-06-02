/**
 * WallDimensionsForm.tsx
 * Controles de dimensiones del muro en tema claro corporativo.
 */

import { useWallSimulatorStore, selectDimensions } from '../../state/wallSimulator.store.ts';
import { SidebarSection } from '../layout/SidebarPanel.tsx';
import { SliderNumberInput } from '../ui/SliderNumberInput.tsx';
import { Tooltip } from '../ui/Tooltip.tsx';

export function WallDimensionsForm() {
  const dimensions    = useWallSimulatorStore(selectDimensions);
  const setDimensions = useWallSimulatorStore((s) => s.setDimensions);

  return (
    <SidebarSection title="Geometría del Muro" icon="📐">
      <SliderNumberInput
        label="Ancho"
        value={dimensions.widthM}
        min={0.5}
        max={10}
        step={0.1}
        unit="m"
        onChange={(v) => setDimensions({ widthM: v })}
      />
      <SliderNumberInput
        label="Altura"
        value={dimensions.heightM}
        min={0.5}
        max={6}
        step={0.1}
        unit="m"
        onChange={(v) => setDimensions({ heightM: v })}
      />
      <SliderNumberInput
        label="Espesor"
        value={dimensions.thicknessM}
        min={0.08}
        max={0.60}
        step={0.01}
        unit="m"
        onChange={(v) => setDimensions({ thicknessM: v })}
      />

      {/* Resumen de geometría */}
      <div className="mt-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Datos Geométricos
        </p>
        <div className="grid grid-cols-2 gap-2 text-[12px] font-mono">
          <span className="text-gray-500 font-medium cursor-help">
            <Tooltip content="<strong>Área base de carga</strong><br/>Calculada como <em>Ancho × Espesor</em>.<br/>Mide cuánta superficie soporta el peso.">
              Área efectiva <span className="text-[10px] bg-gray-100 rounded px-1">?</span>
            </Tooltip>
          </span>
          <span className="text-brand-midnight text-right font-bold">
            {(dimensions.widthM * dimensions.thicknessM).toFixed(3)} 
            <Tooltip content="<strong>Metro Cuadrado (m²)</strong>"> m²</Tooltip>
          </span>
          
          <span className="text-gray-500 font-medium cursor-help">
            <Tooltip content="<strong>Volumen total</strong><br/>Calculado como <em>Área × Espesor</em>.<br/>Usado para calcular el peso propio.">
              Volumen <span className="text-[10px] bg-gray-100 rounded px-1">?</span>
            </Tooltip>
          </span>
          <span className="text-brand-midnight text-right font-bold">
            {(dimensions.widthM * dimensions.heightM * dimensions.thicknessM).toFixed(3)} 
            <Tooltip content="<strong>Metro Cúbico (m³)</strong>"> m³</Tooltip>
          </span>
        </div>
      </div>
    </SidebarSection>
  );
}

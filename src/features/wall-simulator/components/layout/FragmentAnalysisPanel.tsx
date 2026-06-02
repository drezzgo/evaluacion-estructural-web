/**
 * FragmentAnalysisPanel.tsx
 * Panel educativo que explica el estado de los fragmentos del muro,
 * la influencia del material y cargas, y detalla las métricas por cada pieza.
 */

import { useWallSimulatorStore, selectFragments, selectDimensions, selectSimulationResult } from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';
import type { WallFragment } from '../../domain/wall.types.ts';
import { FragmentCharts } from './FragmentCharts.tsx';

export function FragmentAnalysisPanel() {
  const fragments = useWallSimulatorStore(selectFragments);
  const dimensions = useWallSimulatorStore(selectDimensions);
  const result = useWallSimulatorStore(selectSimulationResult);
  
  if (fragments.length <= 1) {
    return null; // Solo mostrar cuando el muro está fragmentado
  }

  const { widthM, heightM, thicknessM } = dimensions;
  const totalVolume = widthM * heightM * thicknessM;
  const totalArea = widthM * heightM;

  const criticalFragment = fragments.find(f => f.isCritical);

  return (
    <div className="bg-gray-50/50 border-t border-gray-100 px-5 py-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-brand-midnight flex items-center gap-2 mb-2 font-display">
          <span className="text-ea-blue">◧</span> Análisis Educativo por Fragmentos
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
          El patrón de agrietamiento seleccionado ha dividido el muro lógicamente en <strong>{fragments.length} piezas</strong>. 
          Al fragmentarse, la transferencia de carga cambia radicalmente. En este modelo educativo simplificado, 
          repartimos la carga total ({result.totalLoadKN.toFixed(1)} kN) proporcionalmente al área de cada fragmento, 
          y le sumamos su peso propio.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed max-w-4xl mt-2">
          <strong>¿Por qué falla una zona antes que otra?</strong> El fragmento crítico es el que presenta menor factor de seguridad bajo la carga aplicada. Generalmente es aquel que soporta mayor esfuerzo por unidad de área, ya sea por acumulación de carga, por tener una base reducida, 
          o por el impacto de un menor espesor ({thicknessM}m). Un material de alta capacidad de compresión ({result.material.displayName}) 
          aumenta el Factor de Seguridad (FS) general, pero el patrón geométrico de la falla es quien dicta el colapso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {fragments.map((frag: WallFragment) => {
          const info = DAMAGE_LEVEL_INFO[frag.damageLevel];
          const isCrit = frag.isCritical;
          const volPct = (frag.volume / totalVolume) * 100;
          
          let badgeColor = info.colorHex;
          let badgeBg = info.colorHex + '15';
          let badgeBorder = info.colorHex + '40';
        
          if (frag.damageLevel === 'none') {
            badgeColor = '#059669'; badgeBg = '#d1fae5'; badgeBorder = '#34d399';
          } else if (frag.damageLevel === 'low') {
            badgeColor = '#d97706'; badgeBg = '#fef3c7'; badgeBorder = '#fbbf24';
          }

          return (
            <div 
              key={frag.id} 
              className={`flex flex-col bg-white rounded-xl border p-4 transition-all
                ${isCrit ? 'border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-200 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-brand-midnight text-sm flex items-center gap-2">
                    Fragmento: {frag.label}
                    {isCrit && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-widest">Crítico</span>}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">Volumen: {volPct.toFixed(1)}% del total</p>
                </div>
                <div 
                  className="px-2 py-1 rounded text-[10px] font-bold border"
                  style={{ color: badgeColor, backgroundColor: badgeBg, borderColor: badgeBorder }}
                >
                  {info.label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Área base</span>
                  <span className="font-mono text-sm font-medium">{frag.area.toFixed(2)} m²</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Volumen</span>
                  <span className="font-mono text-sm font-medium">{frag.volume.toFixed(2)} m³</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Esfuerzo</span>
                  <span className="font-mono text-sm font-medium text-ea-blue">{frag.estimatedStress.toFixed(3)} MPa</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">FS (Seguridad)</span>
                  <span className="font-mono text-sm font-bold" style={{ color: isCrit ? '#ef4444' : '#111827' }}>
                    {frag.safetyFactor > 10 ? '> 10.0' : frag.safetyFactor.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos Comparativos */}
      <FragmentCharts fragments={fragments} />

    </div>
  );
}

/**
 * CrackPatternSelector.tsx
 * Selector de patrón de agrietamiento para la simulación educativa por fragmentos.
 */

import { useWallSimulatorStore, selectCrackPatternType } from '../../state/wallSimulator.store.ts';
import { SidebarSection } from '../layout/SidebarPanel.tsx';
import type { CrackPatternType } from '../../domain/wall.types.ts';

const CRACK_PATTERNS: { id: CrackPatternType; name: string; desc: string; fragments: number; icon: string }[] = [
  { id: 'healthy', name: 'Sano', desc: 'Muro íntegro', fragments: 1, icon: '🟩' },
  { id: 'horizontal', name: 'Horizontal', desc: 'Falla por flexión', fragments: 2, icon: '➖' },
  { id: 'vertical', name: 'Vertical', desc: 'Falla por tensión', fragments: 2, icon: '⏸️' },
  { id: 'diagonal', name: 'Diagonal', desc: 'Falla por cortante', fragments: 2, icon: '◿' },
  { id: 'v-shape', name: 'Forma de V', desc: 'Carga concentrada', fragments: 3, icon: '🔽' },
  { id: 'inverted-v', name: 'V Invertida', desc: 'Asentamiento', fragments: 3, icon: '🔼' },
  { id: 'x-shape', name: 'Forma de X', desc: 'Cortante sísmico', fragments: 4, icon: '❌' },
];

export function CrackPatternSelector() {
  const selectedPattern = useWallSimulatorStore(selectCrackPatternType);
  const setCrackPatternType = useWallSimulatorStore((s) => s.setCrackPatternType);

  const current = CRACK_PATTERNS.find(p => p.id === selectedPattern)!;

  return (
    <SidebarSection title="Estado del Muro" icon="⚡">
      <div className="grid grid-cols-2 gap-2">
        {CRACK_PATTERNS.map((pattern) => {
          const isSelected = pattern.id === selectedPattern;
          return (
            <button
              key={pattern.id}
              onClick={() => setCrackPatternType(pattern.id)}
              className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left
                transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-ea-blue bg-white shadow-[0_0_0_1px_rgba(18,109,166,1),0_4px_12px_rgba(18,109,166,0.1)]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{pattern.icon}</span>
                <span
                  className="text-sm font-semibold leading-tight"
                  style={{
                    color: isSelected ? '#126DA6' : '#242424',
                    fontFamily: "'Cal Sans', Inter, sans-serif",
                  }}
                >
                  {pattern.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-medium text-gray-500 tabular-nums">
                {pattern.fragments} {pattern.fragments === 1 ? 'fragmento' : 'fragmentos'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Propiedades del patrón seleccionado */}
      <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Info del Patrón
        </p>
        <p className="text-[12px] text-gray-600 leading-relaxed">
          <strong className="text-brand-midnight font-semibold">{current.name}:</strong> {current.desc}. 
          El muro se ha fragmentado lógicamente en <strong>{current.fragments}</strong> piezas independientes.
          El simulador calculará la distribución de carga aproximada y mostrará la zona más crítica.
        </p>
      </div>
    </SidebarSection>
  );
}

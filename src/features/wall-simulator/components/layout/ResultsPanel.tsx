/**
 * ResultsPanel.tsx
 * Panel inferior que muestra los resultados en tema claro.
 */

import {
  useWallSimulatorStore,
  selectSimulationResult,
  selectDamageLevel,
  selectFragments,
  selectCriticalFragment,
} from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';
import { FragmentAnalysisPanel } from './FragmentAnalysisPanel.tsx';
import { Tooltip } from '../ui/Tooltip.tsx';

interface MetricCardProps {
  label:     string;
  value:     string;
  sub?:      string;
  highlight?: boolean;
  colorHex?: string;
}

function MetricCard({ label, value, sub, highlight, colorHex }: MetricCardProps) {
  return (
    <div
      className={`flex flex-col gap-1 px-4 py-3 rounded-xl border transition-colors
        ${highlight
          ? 'bg-gray-50 border-gray-200 cal-shadow'
          : 'bg-white border-gray-100'
        }`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold"
        style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </span>
      <span
        className="text-[22px] font-mono font-bold tabular-nums leading-none tracking-tight"
        style={{ color: colorHex ?? '#111111' }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-gray-500 font-medium leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function UtilizationBar({ ratio, colorHex }: { ratio: number; colorHex: string }) {
  const pct = Math.min(ratio * 100, 100);
  return (
    <div className="flex flex-col gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
      <div className="flex justify-between items-end">
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Utilización de Capacidad
        </span>
        <span className="font-mono text-sm font-bold tabular-nums" style={{ color: colorHex }}>
          {(ratio * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${pct}%`, backgroundColor: colorHex }}
        />
      </div>
    </div>
  );
}

export function ResultsPanel() {
  const result = useWallSimulatorStore(selectSimulationResult);
  const fragments = useWallSimulatorStore(selectFragments);
  const criticalFrag = useWallSimulatorStore(selectCriticalFragment);
  const globalLevel = useWallSimulatorStore(selectDamageLevel);
  
  // Si hay una grieta, usamos el estado del fragmento crítico para la UI
  const isFragmented = fragments.length > 1 && criticalFrag;
  const levelToDisplay = isFragmented ? criticalFrag.damageLevel : globalLevel;
  const info = DAMAGE_LEVEL_INFO[levelToDisplay];

  const { stresses, maxCapacityKN, totalLoadKN, selfWeightKN } = result;
  
  // Mostrar los datos del fragmento más crítico si aplica
  const safetyFactorToShow = isFragmented ? criticalFrag.safetyFactor : result.safetyFactor;
  const utilizationRatioToShow = isFragmented ? criticalFrag.utilizationRatio : result.utilizationRatio;

  // Adapt the neon colors for light mode to be slightly darker for legibility, except red.
  let badgeColor = info.colorHex;
  let badgeBg = info.colorHex + '15';
  let badgeBorder = info.colorHex + '40';

  if (levelToDisplay === 'none') {
    badgeColor = '#059669'; // Emerald 600
    badgeBg = '#d1fae5'; // Emerald 100
    badgeBorder = '#34d399'; // Emerald 400
  } else if (levelToDisplay === 'low') {
    badgeColor = '#d97706'; // Amber 600
    badgeBg = '#fef3c7'; // Amber 100
    badgeBorder = '#fbbf24'; // Amber 400
  }

  return (
    <div className="flex flex-col bg-white">

      {/* ── Fila de estado principal ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold shadow-sm w-fit shrink-0"
            style={{
              color: badgeColor,
              borderColor: badgeBorder,
              backgroundColor: badgeBg,
              fontFamily: "'Cal Sans', Inter, sans-serif",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse inline-block"
              style={{ backgroundColor: badgeColor }} />
            {isFragmented ? `Crítico: ${info.label}` : info.label}
          </div>
          
          <div className="flex flex-col">
            <p className="text-sm font-medium text-brand-midnight" style={{ fontFamily: "Inter, sans-serif" }}>
              {info.description}
            </p>
            <span className="text-[11px] font-mono text-gray-400">
              {isFragmented ? `Evaluación por fragmentos (Zona más débil)` : `Rango esperado: ${info.fsRange}`}
            </span>
          </div>
        </div>
        
        {isFragmented && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span className="text-xs text-gray-500 font-medium">Fragmentos:</span>
            <span className="text-sm font-bold text-ea-blue">{fragments.length} piezas</span>
          </div>
        )}
      </div>

      {/* ── Barra de utilización ──────────────────────────────────────── */}
      <UtilizationBar ratio={utilizationRatioToShow} colorHex={badgeColor} />

      {/* ── Grid de métricas ─────────────────────────────────────────── */}

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6 bg-white">
        <MetricCard
          label={isFragmented ? "FS Fragmento Crítico" : "Factor Seguridad"}
          value={safetyFactorToShow > 10 ? '> 10.0' : safetyFactorToShow.toFixed(2)}
          sub={isFragmented ? "Carga / Área del fragmento" : (
            <span className="cursor-help">
              <Tooltip content="<strong>Factor de Seguridad (FS)</strong><br/><em>FS = Capacidad / Esfuerzo</em><br/>Tu reserva estructural. Si es mayor a 1, soporta. Si baja de 1, el muro falla.">
                FS = Cap. / Esf. <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span>
          ) as any}
          highlight
          colorHex={badgeColor}
        />
        <MetricCard
          label={isFragmented ? "Esfuerzo Crítico" : "Esfuerzo Compresión"}
          value={isFragmented ? `${criticalFrag.estimatedStress.toFixed(3)}` : `${stresses.compressiveMPa.toFixed(3)}`}
          sub={
            <span className="cursor-help">
              <Tooltip content="<strong>Megapascal (MPa)</strong><br/><em>Esfuerzo ≈ Carga / Área</em><br/>Unidad de presión interna. 1 MPa equivale a poner 100 camiones sobre 1 m².">
                MPa <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span> as any
          }
        />
        <MetricCard
          label={isFragmented ? "Área Fragmento" : "Esfuerzo Cortante"}
          value={isFragmented ? `${criticalFrag.area.toFixed(2)}` : `${stresses.shearMPa.toFixed(3)}`}
          sub={isFragmented ? (
            <span className="cursor-help">
              <Tooltip content="<strong>Metros Cuadrados (m²)</strong>">
                m² <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span> as any
          ) : "MPa"}
        />
        <MetricCard
          label="Deformación (ε)"
          value={`${(stresses.strainUnitless * 1e6).toFixed(0)}`}
          sub={
            <span className="cursor-help">
              <Tooltip content="<strong>Microstrain (µε)</strong><br/>Deformación relativa minúscula.<br/>Mide cuántos milímetros se acorta el muro por cada kilómetro de altura.">
                Microstrain (µε) <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span> as any
          }
        />
        <MetricCard
          label="Carga Total"
          value={`${totalLoadKN.toFixed(1)}`}
          sub={
            <span className="cursor-help block leading-tight">
              <Tooltip content="<strong>Kilonewton (kN)</strong><br/>Unidad de fuerza exterior.<br/>1 kN equivale aprox. a 100 kg.">
                kN (incl. {selfWeightKN.toFixed(1)} kN peso propio) <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span> as any
          }
        />
        <MetricCard
          label="Capacidad Material"
          value={`${maxCapacityKN.toFixed(0)}`}
          sub={
            <span className="cursor-help">
              <Tooltip content="<strong>Kilonewton (kN)</strong><br/>Fuerza máxima límite teórica que el material puede resistir antes de romperse.">
                kN (teórico límite) <span className="text-[9px] bg-gray-100 rounded px-1 ml-0.5">?</span>
              </Tooltip>
            </span> as any
          }
        />
      </div>

      {/* ── Panel de Análisis de Fragmentos ────────────────────────────── */}
      <FragmentAnalysisPanel />

    </div>
  );
}

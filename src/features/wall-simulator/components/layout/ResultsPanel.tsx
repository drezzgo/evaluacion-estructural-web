/**
 * ResultsPanel.tsx
 * Panel inferior que muestra los resultados en tema claro.
 */

import {
  useWallSimulatorStore,
  selectSimulationResult,
  selectDamageLevel,
} from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';

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
  const level  = useWallSimulatorStore(selectDamageLevel);
  const info   = DAMAGE_LEVEL_INFO[level];

  const { safetyFactor, utilizationRatio, stresses, maxCapacityKN, totalLoadKN, selfWeightKN } = result;

  // Adapt the neon colors for light mode to be slightly darker for legibility, except red.
  let badgeColor = info.colorHex;
  let badgeBg = info.colorHex + '15';
  let badgeBorder = info.colorHex + '40';

  if (level === 'none') {
    badgeColor = '#059669'; // Emerald 600
    badgeBg = '#d1fae5'; // Emerald 100
    badgeBorder = '#34d399'; // Emerald 400
  } else if (level === 'low') {
    badgeColor = '#d97706'; // Amber 600
    badgeBg = '#fef3c7'; // Amber 100
    badgeBorder = '#fbbf24'; // Amber 400
  }

  return (
    <div className="flex flex-col bg-white">

      {/* ── Fila de estado principal ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 border-b border-gray-100">
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
          {info.label}
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm font-medium text-brand-midnight" style={{ fontFamily: "Inter, sans-serif" }}>
            {info.description}
          </p>
          <span className="text-[11px] font-mono text-gray-400">Rango esperado: {info.fsRange}</span>
        </div>
      </div>

      {/* ── Barra de utilización ──────────────────────────────────────── */}
      <UtilizationBar ratio={utilizationRatio} colorHex={badgeColor} />

      {/* ── Grid de métricas ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6 bg-white">
        <MetricCard
          label="Factor Seguridad"
          value={safetyFactor > 10 ? '> 10.0' : safetyFactor.toFixed(2)}
          sub="FS = Capacidad / Esfuerzo"
          highlight
          colorHex={badgeColor}
        />
        <MetricCard
          label="Esfuerzo Compresión"
          value={`${stresses.compressiveMPa.toFixed(3)}`}
          sub="MPa"
        />
        <MetricCard
          label="Esfuerzo Cortante"
          value={`${stresses.shearMPa.toFixed(3)}`}
          sub="MPa"
        />
        <MetricCard
          label="Deformación (ε)"
          value={`${(stresses.strainUnitless * 1e6).toFixed(0)}`}
          sub="Microstrain (με)"
        />
        <MetricCard
          label="Carga Total"
          value={`${totalLoadKN.toFixed(1)}`}
          sub={`kN (incl. ${selfWeightKN.toFixed(1)} kN peso propio)`}
        />
        <MetricCard
          label="Capacidad Material"
          value={`${maxCapacityKN.toFixed(0)}`}
          sub="kN (teórico límite)"
        />
      </div>

    </div>
  );
}

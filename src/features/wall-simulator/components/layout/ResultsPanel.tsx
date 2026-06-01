/**
 * ResultsPanel.tsx
 * Panel inferior que muestra los resultados de la simulación en tiempo real.
 * Lee del store de Zustand sin lógica de cálculo propia.
 */

import {
  useWallSimulatorStore,
  selectSimulationResult,
  selectDamageLevel,
} from '../../state/wallSimulator.store.ts';
import { DAMAGE_LEVEL_INFO } from '../../simulation/calculateDamageLevel.ts';

// ─── Sub-componentes ────────────────────────────────────────────────────────

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
      className={`flex flex-col gap-1 px-4 py-3 rounded-lg border transition-colors
        ${highlight
          ? 'bg-white/5 border-white/15'
          : 'bg-transparent border-white/8'
        }`}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold"
        style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </span>
      <span
        className="text-xl font-mono font-semibold tabular-nums leading-none"
        style={{ color: colorHex ?? '#ffffff' }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-white/30" style={{ fontFamily: "Inter, sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Barra de utilización ──────────────────────────────────────────────────

function UtilizationBar({ ratio, colorHex }: { ratio: number; colorHex: string }) {
  const pct = Math.min(ratio * 100, 100);
  return (
    <div className="flex flex-col gap-1.5 px-4 py-3">
      <div className="flex justify-between text-[10px]">
        <span className="uppercase tracking-widest text-white/40 font-semibold"
          style={{ fontFamily: "Inter, sans-serif" }}>
          Utilización del material
        </span>
        <span className="font-mono tabular-nums" style={{ color: colorHex }}>
          {(ratio * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: colorHex }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-white/20 font-mono">
        <span>0% — Sin carga</span>
        <span>100% — Límite material</span>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

export function ResultsPanel() {
  const result = useWallSimulatorStore(selectSimulationResult);
  const level  = useWallSimulatorStore(selectDamageLevel);
  const info   = DAMAGE_LEVEL_INFO[level];

  const { safetyFactor, utilizationRatio, stresses, maxCapacityKN, totalLoadKN, selfWeightKN } = result;

  return (
    <div className="px-2 py-2">

      {/* ── Fila de estado principal ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2 mb-2">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold"
          style={{
            color:           info.colorHex,
            borderColor:     info.colorHex + '40',
            backgroundColor: info.colorHex + '15',
            fontFamily:      "'Cal Sans', Inter, sans-serif",
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse inline-block"
            style={{ backgroundColor: info.colorHex }} />
          {info.label}
        </div>
        <p className="text-xs text-white/40 flex-1 truncate" style={{ fontFamily: "Inter, sans-serif" }}>
          {info.description}
        </p>
        <span className="text-[10px] font-mono text-white/25 shrink-0">{info.fsRange}</span>
      </div>

      {/* ── Barra de utilización ──────────────────────────────────────── */}
      <UtilizationBar ratio={utilizationRatio} colorHex={info.colorHex} />

      {/* ── Grid de métricas ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-1.5 px-2 sm:grid-cols-4 lg:grid-cols-6 mt-1">
        <MetricCard
          label="Factor de Seguridad"
          value={safetyFactor > 10 ? '> 10.0' : safetyFactor.toFixed(2)}
          sub="FS = capacidad / esfuerzo"
          highlight
          colorHex={info.colorHex}
        />
        <MetricCard
          label="Esfuerzo Actuante"
          value={`${stresses.compressiveMPa.toFixed(3)}`}
          sub="MPa (compresión)"
        />
        <MetricCard
          label="Cortante"
          value={`${stresses.shearMPa.toFixed(3)}`}
          sub="MPa"
        />
        <MetricCard
          label="Deformación (ε)"
          value={`${(stresses.strainUnitless * 1e6).toFixed(0)}`}
          sub="microstrain (με)"
        />
        <MetricCard
          label="Carga Total"
          value={`${totalLoadKN.toFixed(1)}`}
          sub={`kN (incl. ${selfWeightKN.toFixed(1)} kN propio)`}
        />
        <MetricCard
          label="Capacidad Máxima"
          value={`${maxCapacityKN.toFixed(0)}`}
          sub="kN (teórico)"
        />
      </div>

      {/* ── Aviso educativo ───────────────────────────────────────────── */}
      <p className="text-[9px] text-white/20 text-center mt-2 pb-1 font-mono">
        ⚠ Simulación educativa — valores aproximados — no usar para diseño estructural real
      </p>
    </div>
  );
}

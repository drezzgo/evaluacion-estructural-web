/**
 * SidebarPanel.tsx
 * Contenedor del panel lateral izquierdo con secciones colapsables.
 */

import type { ReactNode } from 'react';

interface SidebarPanelProps {
  children: ReactNode;
}

interface SectionProps {
  title:    string;
  icon:     string;
  children: ReactNode;
}

/** Sección individual dentro del sidebar con separador. */
export function SidebarSection({ title, icon, children }: SectionProps) {
  return (
    <div className="border-b border-white/8">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="text-base">{icon}</span>
        <span
          className="text-xs font-semibold tracking-widest uppercase text-white/40"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </span>
      </div>
      <div className="px-4 pb-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

/** Contenedor raíz del sidebar. */
export function SidebarPanel({ children }: SidebarPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  );
}

// ─── Primitivos de UI reutilizables en el sidebar ─────────────────────────

interface LabeledSliderProps {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step:     number;
  unit:     string;
  onChange: (value: number) => void;
}

/** Slider con etiqueta y valor numérico inline. */
export function LabeledSlider({ label, value, min, max, step, unit, onChange }: LabeledSliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </label>
        <span className="text-xs font-mono text-[#3ab7bf] tabular-nums">
          {value.toFixed(2)}<span className="text-white/30 ml-0.5">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer
                   bg-white/10
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-3.5
                   [&::-webkit-slider-thumb]:h-3.5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[#126DA6]
                   [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-white/20
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-white/20 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

/**
 * SidebarPanel.tsx
 * Contenedor del panel lateral izquierdo adaptado a tema claro.
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

export function SidebarSection({ title, icon, children }: SectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 px-5 py-4 bg-white/50">
        <span className="text-lg">{icon}</span>
        <span
          className="text-[11px] font-bold tracking-widest uppercase text-brand-midnight"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </span>
      </div>
      <div className="px-5 pb-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

export function SidebarPanel({ children }: SidebarPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  );
}

// ─── Primitivos de UI ───────────────────────────────────────────────────────

interface LabeledSliderProps {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step:     number;
  unit:     string;
  onChange: (value: number) => void;
}

export function LabeledSlider({ label, value, min, max, step, unit, onChange }: LabeledSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[13px] font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </label>
        <span className="text-[13px] font-mono font-semibold text-ea-blue tabular-nums bg-ea-blue/5 px-2 py-0.5 rounded">
          {value.toFixed(2)}<span className="text-gray-400 font-normal ml-0.5">{unit}</span>
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
                   bg-gray-200
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:border-[3px]
                   [&::-webkit-slider-thumb]:border-ea-blue
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-ea-blue/20"
      />
      <div className="flex justify-between text-[11px] text-gray-400 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

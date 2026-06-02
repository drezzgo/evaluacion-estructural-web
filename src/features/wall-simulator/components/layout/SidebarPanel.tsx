/**
 * SidebarPanel.tsx
 * Contenedor del panel lateral izquierdo adaptado a tema claro.
 */

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SidebarPanelProps {
  children: ReactNode;
}

interface SectionProps {
  title:    string;
  icon:     string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarSection({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        className="w-full flex items-center justify-between px-5 py-4 bg-white/50 hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span
            className="text-[11px] font-bold tracking-widest uppercase text-brand-midnight"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {title}
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function SidebarPanel({ children }: SidebarPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white">
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
  const [localStr, setLocalStr] = useState(value.toString());

  useEffect(() => {
    setLocalStr(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLocalStr(e.target.value);
    onChange(val);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStr(e.target.value);
  };

  const handleBlur = () => {
    let parsed = parseFloat(localStr);
    if (isNaN(parsed)) {
      parsed = value;
    } else {
      parsed = Math.max(min, Math.min(max, parsed));
    }
    setLocalStr(parsed.toString());
    onChange(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleBlur();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[13px] font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded text-[13px] px-2 py-0.5 focus-within:border-ea-blue focus-within:ring-1 focus-within:ring-ea-blue transition-colors">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localStr}
            onChange={handleNumberChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-14 bg-transparent border-none outline-none text-right font-mono font-semibold text-ea-blue tabular-nums"
          />
          <span className="text-gray-400 font-normal ml-1 font-mono">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
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

import React, { useState, useEffect } from 'react';

interface SliderNumberInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  tooltipContent?: React.ReactNode;
}

export function SliderNumberInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  tooltipContent
}: SliderNumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  // Update local input if external value changes (e.g. store reset)
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    setLocalValue(e.target.value);
    onChange(num);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleNumberBlur = () => {
    let num = parseFloat(localValue);
    if (isNaN(num)) {
      num = value; // revert if invalid
    } else {
      // Clamp value
      num = Math.max(min, Math.min(max, num));
    }
    setLocalValue(num.toString());
    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNumberBlur();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
          {label}
        </label>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="flex-grow h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ea-blue"
        />
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded text-sm px-2 w-24 focus-within:border-ea-blue focus-within:ring-1 focus-within:ring-ea-blue transition-colors">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none py-1.5 text-right font-mono text-brand-midnight"
          />
          <span className="text-gray-400 font-mono ml-1 select-none">{unit}</span>
        </div>
      </div>
    </div>
  );
}

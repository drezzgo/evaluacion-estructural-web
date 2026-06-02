import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-[100] ${positionClasses[position]} w-64 p-2.5 bg-gray-800 text-white text-[11px] leading-relaxed rounded-md shadow-xl pointer-events-none opacity-0 animate-fade-in-fast font-sans`}>
          <div dangerouslySetInnerHTML={{ __html: String(content) }} />
          {/* Arrow */}
          <div className={`absolute border-[5px] w-0 h-0 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
}

// Add global styles for animation in an appropriate place, or just use tailwind arbitrary values.
// We can use style tag here safely.
export function TooltipStyles() {
  return (
    <style>{`
      @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(4px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
      }
      .animate-fade-in-fast {
        animation: tooltipFadeIn 0.15s ease-out forwards;
      }
    `}</style>
  );
}

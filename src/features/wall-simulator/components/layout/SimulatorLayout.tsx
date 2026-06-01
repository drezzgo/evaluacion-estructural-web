/**
 * SimulatorLayout.tsx
 * Layout principal de tres zonas del simulador de muros.
 *
 * Zonas:
 *   ┌──────────┬─────────────────────────────────┐
 *   │ Sidebar  │     Main Canvas / Placeholder   │
 *   │ (inputs) │                                 │
 *   ├──────────┴─────────────────────────────────┤
 *   │           Results Panel                    │
 *   └────────────────────────────────────────────┘
 */

import type { ReactNode } from 'react';

interface SimulatorLayoutProps {
  sidebar: ReactNode;
  main:    ReactNode;
  results: ReactNode;
}

export function SimulatorLayout({ sidebar, main, results }: SimulatorLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#111111] text-white overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#111111] shrink-0">
        <div className="flex items-center gap-3">
          {/* Blueprint grid icon */}
          <div className="w-7 h-7 grid grid-cols-3 gap-px opacity-60">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-[#126DA6] rounded-sm" />
            ))}
          </div>
          <span
            className="text-sm font-semibold tracking-wide text-white/90"
            style={{ fontFamily: "'Cal Sans', Inter, sans-serif" }}
          >
            Simulador Estructural
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#126DA6]/20 text-[#3ab7bf] border border-[#126DA6]/30 font-mono">
            EDUCATIVO
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Motor activo
        </div>
      </header>

      {/* ── Body: sidebar + main ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar izquierdo (inputs) */}
        <aside className="w-72 shrink-0 border-r border-white/10 overflow-y-auto bg-[#161616]">
          {sidebar}
        </aside>

        {/* Zona central (canvas / placeholder) */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {main}
          </div>

          {/* Panel de resultados inferior */}
          <section className="shrink-0 border-t border-white/10 bg-[#161616]">
            {results}
          </section>
        </main>

      </div>
    </div>
  );
}

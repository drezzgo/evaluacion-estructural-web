/**
 * SimulatorLayout.tsx
 * Layout principal del simulador de muros adaptado al tema claro corporativo.
 */

import type { ReactNode } from 'react';

interface SimulatorLayoutProps {
  sidebar: ReactNode;
  main:    ReactNode;
  results: ReactNode;
}

export function SimulatorLayout({ sidebar, main, results }: SimulatorLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-white text-brand-charcoal overflow-hidden">
      {/* ── Body: sidebar + main ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Sidebar izquierdo (inputs) */}
        <aside className="w-full md:w-80 shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
          {sidebar}
        </aside>

        {/* Zona central (canvas) y resultados */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
          <div className="flex-1 overflow-hidden relative">
            {main}
          </div>

          {/* Panel de resultados inferior flotante o adherido */}
          <section className="shrink-0 border-t border-gray-100 bg-white z-10">
            {results}
          </section>
        </main>

      </div>
    </div>
  );
}

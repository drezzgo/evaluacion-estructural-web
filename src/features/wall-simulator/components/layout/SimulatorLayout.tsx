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
    <div className="flex flex-col h-full bg-white text-brand-charcoal">
      {/* ── Body: sidebar + main ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row flex-1">

        {/* Sidebar izquierdo (inputs) */}
        <aside className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
          {sidebar}
        </aside>

        {/* Zona central (canvas) y resultados */}
        <main className="flex-1 flex flex-col bg-white min-w-0">
          
          {/* Canvas container con altura explícita para asegurar que siempre sea visible */}
          <div className="w-full h-[450px] md:h-[600px] shrink-0 relative bg-white">
            {main}
          </div>

          {/* Panel de resultados inferior */}
          <section className="flex-1 border-t border-gray-100 bg-white">
            {results}
          </section>
        </main>

      </div>
    </div>
  );
}

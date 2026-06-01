/**
 * WallSimulatorApp.tsx
 * Componente raíz del simulador. Ensambla layout, controles y resultados.
 * Montado en Astro con client:only="react" para evitar SSR con el Canvas WebGL.
 *
 * ⚠️ AVISO EDUCATIVO — Simulación simplificada, no profesional.
 */

import { SimulatorLayout }     from './layout/SimulatorLayout.tsx';
import { SidebarPanel }        from './layout/SidebarPanel.tsx';
import { ResultsPanel }        from './layout/ResultsPanel.tsx';
import { WallDimensionsForm }  from './controls/WallDimensionsForm.tsx';
import { MaterialSelector }    from './controls/MaterialSelector.tsx';
import { LoadControls }        from './controls/LoadControls.tsx';
import { WallScene3D }         from './scene/WallScene3D.tsx';

// ─── App principal ─────────────────────────────────────────────────────────

export function WallSimulatorApp() {
  return (
    <SimulatorLayout
      sidebar={
        <SidebarPanel>
          <WallDimensionsForm />
          <MaterialSelector />
          <LoadControls />
        </SidebarPanel>
      }
      main={<WallScene3D />}
      results={<ResultsPanel />}
    />
  );
}

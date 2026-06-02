/**
 * @file polygonMath.ts
 * @description Utilidades matemáticas para calcular área y centroide de polígonos 2D.
 */

/**
 * Calcula el área de un polígono usando la fórmula de los cordones (Shoelace formula).
 * @param points Puntos 2D del polígono
 * @returns Área del polígono
 */
export function calculatePolygonArea(points: { x: number; y: number }[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calcula el centroide (centro de masa geométrico) de un polígono cerrado.
 * @param points Puntos 2D del polígono
 * @returns Coordenadas { x, y } del centroide
 */
export function calculatePolygonCentroid(points: { x: number; y: number }[]): { x: number; y: number } {
  if (points.length < 3) return { x: 0, y: 0 };

  let cx = 0;
  let cy = 0;
  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const factor = points[i].x * points[j].y - points[j].x * points[i].y;
    cx += (points[i].x + points[j].x) * factor;
    cy += (points[i].y + points[j].y) * factor;
    area += factor;
  }

  area /= 2;
  
  if (area === 0) return { x: 0, y: 0 }; // Prevenir división por cero

  const factorTotal = 1 / (6 * area);
  return {
    x: Math.abs(cx * factorTotal),
    y: Math.abs(cy * factorTotal),
  };
}

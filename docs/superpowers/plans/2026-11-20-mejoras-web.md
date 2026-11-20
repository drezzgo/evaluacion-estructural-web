# Plan de mejora del sitio corporativo

> Ejecución local con superpowers:executing-plans. Las casillas reflejan el estado de cada verificación.

**Objetivo** Mejorar el recorrido servicio → información → confianza → contacto y corregir las señales técnicas verificadas.

**Arquitectura** Reutilizar Astro, Tailwind, colecciones y componentes compartidos. Mantener React y Three.js para la ruta del simulador. Verificar con una copia de compilación local y Edge mediante CDP.

**Especificación** [Auditoría](../../auditoria-web.md), [Producto](../../../PRODUCT.md) e [Identidad](../../../DESIGN.md).

## Restricciones

Mismos slugs, logotipo, paleta, familias tipográficas y contenido técnico. Cambios locales, sin commits, publicación, infraestructura ni comunicaciones reales. Mantener la edición previa de `skills-lock.json`. La configuración local del canonical refleja el HTTP observado en Vercel.

## Pasos

### 1. Navegación y contacto

- [x] Registrar casos fallidos para Escape, salto de foco y solicitud completa con acentos y símbolos. Probar configuración ausente, provisional y número de prueba.
- [x] Ajustar `Header.astro`, `HeaderLink.astro`, `Footer.astro` y landmarks. Mantener ClientRouter y usar `details/summary` para navegación accesible sin JavaScript.
- [x] Construir la solicitud con `src/lib/contact.ts` y un componente `ContactForm.astro`. Aceptar texto internacional en teléfono, impedir campos vacíos y ofrecer un borrador seleccionable cuando falte el destino. Probar que no se navega a un destinatario inventado.

### 2. Claridad, adaptación y rendimiento

- [x] Aplicar `typeset`, `layout`, `clarify`, `adapt`, `harden` y `optimize` a `global.css`, portada, listados y Nosotros. Mantener iconos, retícula y esquemas. Mostrar servicios y acciones con una escala legible y separación consistente.
- [x] Hacer estático el esquema de portada y retirar las entradas animadas que ocultan contenido. Revisar al menos modo reducido y navegación con JS desactivado.
- [x] Reutilizar `astro:assets` para miniaturas y fotos con dimensiones y formatos adecuados. Mantener la imagen principal de artículos disponible desde el HTML.

### 3. SEO técnico y editorial

- [x] Alinear `BaseHead.astro`, `astro.config.mjs`, robots y RSS con el host final. Generar sitemap con páginas canónicas y sin fechas sintéticas.
- [x] Distinguir metadata por ruta. Corregir H1 duplicados en colección, fechas ficticias, idioma de fechas y navegación de retorno en `BlogPost.astro`. Añadir datos de Organization basados en nombre, URL y logotipo publicados.
- [x] Mantener accesibles las tres copias de guías en proyectos y consolidarlas cuando coincidan con blog. Clasificar el prototipo vacío como fuera de indexación.

### 4. Verificación

- [x] Compilar y revisar tipos con scripts existentes, ejecutar pruebas focalizadas y auditar el HTML generado y sus enlaces internos.
- [x] Capturar antes y después en Edge con condiciones iguales, comprobar 360, 390, 768, 1280 y 1440 px, foco, teclado, movimiento reducido, errores y flujos en seco.
- [x] Aplicar `polish`, repetir las revisiones de diseño y SEO, revisar diff con un segundo agente y conservar la evidencia en el workspace.

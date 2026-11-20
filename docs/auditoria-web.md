# Auditoría de Evaluación Estructural SAS

## Línea base y alcance

Revisión local del estado inicial de main y comprobación pública del 20 de noviembre de 2026. La única edición previa de Git era `skills-lock.json`. No se encontró AGENTS.md aplicable. Hay un conflicto de texto ya registrado en README.md. El repositorio usa Astro 6.1.8 estático, pnpm, Tailwind 4, Markdown/MDX, React 19 y Three.js en el simulador. Vercel responde en producción y el repositorio integra Vercel Analytics. La documentación local identifica WordPress como antecedente. El árbol actual genera su propio contenido estático.

Las rutas observadas en código y sitemap incluyen inicio, servicios y ocho fichas, proyectos y tres fichas, blog y cinco artículos, nosotros, simulador, prototipo, RSS y sitemap. `/prototype/` estaba vacía. `/simulador/` ya declaraba noindex. El formulario redactaba un mensaje de WhatsApp. Las tres redes sociales del pie apuntaban a `#`.

La revisión consultó la [portada pública](https://www.evaluacionestructural.com/), la [ficha pública](https://www.evaluacionestructural.com/servicios/vulnerabilidad-sismica/), las [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), la [documentación de sitemap de Astro](https://docs.astro.build/en/guides/integrations-guide/sitemap/) y la [guía de canonical de Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Hallazgos priorizados

| Prioridad | Problema y evidencia inicial | Ubicación e impacto | Corrección y criterio de aceptación |
| --- | --- | --- | --- |
| P0 | El número marcado como provisional coincide con el publicado. El script del formulario ignora dos campos e interpola datos personales en una ventana emergente. | `Header.astro`, `index.astro`, `about.astro`, listado de servicios. Se puede perder la consulta o dirigirla al destinatario equivocado. | Configuración única para un número oficial, fallback de borrador local y validación. Los cinco campos se recuperan, los caracteres especiales sobreviven y las pruebas bloquean la red de WhatsApp. |
| P1 | El script del menú registra eventos en nodos que sustituye ClientRouter. El enlace móvil muestra literalmente `line" >`. Falta acceso directo al contenido. | `Header.astro`, `HeaderLink.astro`. Afecta teclado, navegación entre páginas y tablet. | Menú nativo y cierre con Escape, foco restablecido, marcas de página actual y enlace para saltar al contenido. Comprobar después de navegar y con JavaScript desactivado. |
| P1 | Contenido con opacidad cero antes del script, animación permanente y módulo del hero con `return` en el nivel superior. | `index.astro`, `about.astro`, `HeroThreeJS.astro`, `ScrollAnimations.astro`. Lectura frágil, movimiento y trabajo innecesario. | Mostrar el contenido desde HTML y conservar un esquema estructural estático. Verificar sin JavaScript y con movimiento reducido. |
| P1 | Las etiquetas en gris claro sobre blanco pierden contraste. La regla global de encabezados fuera de las capas de Tailwind puede oscurecer los títulos de paneles oscuros. | `global.css`, pie, formulario, portada y CTA de servicios. WCAG 1.4.3, 1.4.11, 2.4.7. | Colores legibles, borde de campos visible y foco claro. Comprobar con colores computados y navegación por teclado. |
| P1 | `.co` redirige con 308 a `.com` en inicio y ficha de vulnerabilidad. El destino HTTP 200 declara canonical en `.co`. El sitemap 200 de `.com` también usa `.co`. `robots.txt` devuelve 404. | Configuración Astro y cabecera compartida. Señales de indexación contradictorias. | Generar canonical, URL social, RSS, robots y sitemap en el host que devuelve 200. Validar cada página incluida y conservar redirecciones existentes. |
| P2 | Encabezados saltan de H1 a H4 en listados. Artículos duplican su H1 y «Volver» depende del historial. Los servicios aparentan fecha de publicación nueva en cada build. | `BlogPost.astro`, listados, Markdown y MDX. Orientación y lectura imprecisas. | Un H1 por ruta, orden de niveles, enlace a la colección y fechas reales cuando existan. La navegación desde acceso directo termina en un destino predecible. |
| P2 | Hero alto, tarjetas de 12 px y columnas demasiado tempranas. Los resúmenes se cortan y «Ver detalles» se repite. | `index.astro`, listados, `about.astro`. Se dificulta entender los servicios antes de contactar. | Mantener las fuentes y ordenar bloques con texto de lectura regular, tarjetas fluidas y destinos explícitos. Verificar de 360 a 1440 px. |
| P2 | Miniaturas de portada usan JPG de origen sin tamaños adaptativos. Inter se declara en varias páginas e Atkinson se precarga en todas. | `BaseHead.astro`, portada, listados y plantilla de detalle. Recursos iniciales y escala inconsistentes. | Compartir la carga de Inter, retirar la precarga sin uso y servir miniaturas dimensionadas, responsivas y diferidas cuando están fuera de la primera pantalla. |
| P2 | Los tres archivos de proyectos coinciden byte a byte con tres artículos. El prototipo vacío aparece en el sitemap. El sitemap inventa una fecha de última modificación por compilación. | Colecciones y configuración de sitemap. Duplicación y rastreo de URLs sin señal propia. | Conservar esas rutas, canonicalizar las copias comprobadas y excluirlas junto con el prototipo del mapa. Omitir fechas sintéticas. Rotular las guías como guías. |
| P2 | Los textos públicos citan métricas, hitos, normativa y promesas que el repositorio repite sin documentación probatoria adjunta. | Inicio, Nosotros y fichas técnicas. La validación corresponde a la firma. | Preservar las afirmaciones existentes y elevar cualquier reinterpretación a revisión profesional. |
| P3 | Enlaces de redes sociales con `#`, reverso visual de tarjetas y adornos en movimiento compiten con la lectura. | Pie e interfaz compartida. Acciones sin destino o distracciones. | Retirar los tres destinos vacíos y dar al pie un acceso al formulario. Mantener la retícula, el isotipo y la iconografía. |

## Crítica del recorrido

La composición de retícula y esquema técnico identifica el oficio. El punto de entrada muestra pronto las tres especialidades y ofrece dos caminos claros. En pantalla estrecha la altura inicial desplaza el catálogo y hace difícil comparar las opciones. Un propietario que llega desde un artículo debe poder volver a una colección o consultar por un servicio sin depender del historial. Una persona que revisa la experiencia de la firma necesita saber si una tarjeta lleva a una guía o a un caso documentado. Antes de pasar a WhatsApp importa informar qué ocurrirá y reflejar el servicio que eligió.

Revisión de diseño y detector de Impeccable en un solo contexto, por la indicación de evitar aprobaciones intermedias. El detector señaló degradados de texto y tamaños dispersos. Su observación sobre Inter es una preferencia estética y el briefing exige mantener la tipografía. Se omite el cierre con preguntas de la crítica según el modo de trabajo solicitado. Escala de 0 a 4 para la revisión inicial: accesibilidad 2, rendimiento 2, consistencia de tema 2, adaptación 2 e integridad 2. Son juicios de auditoría, sin equivalencia con Lighthouse.

## Límites de la línea base

- `pnpm dev` intentó reinstalar las dependencias. La alternativa confirmó que las uniones de `node_modules` siguen apuntando a la ubicación anterior del proyecto. Se preservó ese árbol y se creó una copia de la fuente inicial con el lockfile para verificar.
- La auditoría de indexación pública cubre HTTP y HTML. Falta acceso a Search Console y a datos de usuarios. La revisión estructurada por navegador es una comprobación adicional.
- `ui-ux-pro-max` no está instalada en los catálogos disponibles y se omitió.

## Verificación final

- El HTML compilado conserva las 23 rutas de página previas. Se comprobaron 564 enlaces internos, los ocho fragmentos de encabezado conservados, un H1 por página y 18 URLs en el sitemap. El canonical y `og:url` coinciden. RSS, robots y previews apuntan a `.com`; las tres copias de guías usan el canonical de Blog y sus URLs siguen accesibles.
- La compilación local terminó con código 0. El aviso de Vite por el chunk de más de 500 kB del simulador se reproduce antes y después. `astro check` pasó de un error y 14 sugerencias a cero errores, cero advertencias y nueve sugerencias preexistentes. El bloque que dibuja la línea del simulador usa el alias oficial `threeLine` de React Three Fiber. `node --experimental-strip-types --test` pasó 4/4 pruebas. El proyecto carece de un comando de lint.
- Edge inspeccionó ocho rutas a 360, 390, 768, 1280 y 1440 px, antes y después. El desbordamiento inicial a 768 px alcanzó 55 px y se redujo a cero en el conjunto final. Los 40 casos finales carecían de errores de consola y fallos de solicitudes no bloqueadas. Se probaron el enlace de salto a contenido, la apertura por teclado con Espacio, el cierre con Escape y retorno de foco, el toque emulado, la reapertura tras navegar y el modo de movimiento reducido. Con JavaScript desactivado se verificaron la lectura del contenido y la plantilla de contacto.
- El formulario requiere los cinco campos, conserva acentos y saltos de línea, preselecciona el servicio desde su ficha y actualiza el borrador si cambian los datos. Sin número configurado, el usuario puede preparar y copiar su consulta. La variante con un número ficticio comprueba la URL y el mensaje en el DOM. Las pruebas bloquearon las solicitudes a WhatsApp y Analytics.
- La firma pidió conservar las imágenes de referencia hasta reemplazarlas por material propio. Se recuperó la asignación original de las cinco entradas de Blog, las tres de Proyectos y la ilustración de Nosotros. Astro genera tamaños adaptativos. La tarjeta social predeterminada usa el isotipo de la firma.
- El detector final de Impeccable devuelve cero avisos en páginas. En componentes únicamente vuelve a señalar Inter por su popularidad. Se mantiene como tipografía establecida por la marca. La revisión independiente dio lugar a correcciones del contexto del servicio, fragmentos históricos, respaldo sin JavaScript y contraste del aviso del simulador.

### Comparación de laboratorio

Edge 157, compilaciones estáticas en localhost, caché desactivada, escala 1 y mismos anchos. Esta medición y las capturas comparativas se realizaron antes de restablecer las imágenes de referencia. El volumen contabiliza los recursos visibles para Resource Timing y la fila JS indica bytes decodificados de recursos con iniciador script. Las cifras de tiempo son observaciones puntuales de laboratorio.

| Portada | Antes | Después |
| --- | ---: | ---: |
| Transferencia a 390 px | 251,1 kB | 90,4 kB |
| Solicitudes a 390 px | 15 | 8 |
| JS decodificado a 390 px | 56,7 kB | 15,8 kB |
| LCP observado a 390 px | 296 ms | 172 ms |
| LCP observado a 1280 px | 200 ms | 160 ms |
| CLS observado a 1280 px | 0,0120 | 0,0003 |

Evidencia local en [Edge antes](../.astro/site-audit/evidence/antes.json), [Edge después](../.astro/site-audit/evidence/despues.json), [prueba con destino ficticio](../.astro/site-audit/evidence/configurado.json) e [inspección SEO](../.astro/site-audit/evidence/seo-final.json). Las imágenes `antes-*.jpg` y `despues-*.jpg` se guardaron en la misma carpeta para portada, menú, formulario, listados, detalle, Nosotros y simulador.

### Comprobaciones tras recuperar la sesión

Los 95 archivos de fuentes, recursos públicos, pruebas y configuración coinciden byte a byte con los de la copia de compilación final. Se volvieron a comprobar los cuatro casos unitarios y los 564 enlaces internos. El informe de la variante de contacto ya registraba el cambio al patrón Diagonal en el simulador, con el lienzo visible y la indicación «Falla por cortante».

En Edge a 390 px se abrió el menú de servicios con los scripts de la página desactivados. En el formulario se probaron los dos resultados del permiso de portapapeles con una implementación simulada. Al aceptar, el botón copió el borrador completo y anunció la confirmación. Al denegar, seleccionó todo el texto, devolvió el foco al borrador e indicó cómo copiarlo. [Resultados de la reanudación](../.astro/site-audit/evidence/reanudacion.json)

## Pendientes externos

- El titular debe confirmar el destinatario oficial y proporcionar `PUBLIC_WHATSAPP_NUMBER` en la compilación autorizada. Formato de país y número, con dígitos y un prefijo `+` opcional. Mientras falte, aparece el borrador local. Para reproducir la prueba de código en Node 22.12 o superior use `node --experimental-strip-types --test`.
- Al publicar con autorización, comprobar en producción que `.co` conserva su redirección y que `.com` sirve HTML, robots.txt y sitemap con la URL final. Revisar esas URLs y su indexación en Search Console.
- Solicitar a la firma respaldo de cifras, hitos y promesas técnicas existentes. Los tres artículos que figuran bajo Proyectos se identifican como guías hasta disponer de casos reales que la firma pueda publicar. Los perfiles sociales requieren enlaces confirmados.
- La prueba usó Edge emulado. Quedan por revisar lector de pantalla, dispositivos físicos, otros motores, y datos de uso real de Core Web Vitals. Para reproducir el flujo, iniciar el preview de la compilación y recorrer con teclado y lector la cabecera, una ficha y el borrador de consulta. Lighthouse no estaba instalado.

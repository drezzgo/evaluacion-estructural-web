---
name: Evaluación Estructural SAS
description: Sitio corporativo de consultoría e ingeniería estructural.
colors:
  primary: "#126da6"
  accent: "#3ab7bf"
  charcoal: "#242424"
  midnight: "#111111"
  muted: "#64748b"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Cal Sans, Inter, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "12px"
  card: "16px"
  panel: "24px"
  pill: "9999px"
spacing:
  gutter: "24px"
  column-gap: "24px"
  max-width: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "48px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
---

## Overview

La firma se reconoce por el isotipo de `public/favicon.svg`, la combinación de azul, turquesa y carbón, y las referencias a planos y retículas. Los esquemas de estructura y los iconos lineales vinculan la interfaz con el trabajo de ingeniería. La identidad usa un fondo claro y un tono profesional en español, con tratamiento de usted en las consultas.

## Colors

El azul identifica enlaces, apoyos gráficos y acciones de contacto. El turquesa es un acento del isotipo y las ilustraciones. Carbón y medianoche sostienen el contraste en textos y paneles. Las etiquetas grises demasiado claras y los títulos oscuros sobre paneles oscuros son inconsistencias de aplicación. Usar grises con contraste legible, preservar el turquesa como acento gráfico y mantener intacto el archivo de marca.

## Typography

Cal Sans es la fuente display local. Inter es la fuente de lectura solicitada por las páginas corporativas, con respaldo del sistema. Atkinson aparece precargada en la cabecera previa sin una asignación de lectura equivalente. Mantener Cal Sans e Inter, usar pesos de lectura regulares y limitar la anchura de los textos largos.

## Layout

El sitio usa un contenedor de hasta 1200 px, márgenes laterales próximos a 24 px y rejillas que se apilan en móvil. El encabezado permanece visible. Las portadas de listados emplean retícula y texto centrado, y el contenido editorial usa una columna más estrecha. El espaciado de la portada puede compactarse para que el inicio del catálogo quede cerca de la primera pantalla. La navegación cambia a menú compacto hasta que marca, enlaces y contacto caben juntos.

## Elevation & Depth

Las tarjetas blancas usan borde y sombra azul muy tenue. Las retículas y esquemas aportan profundidad visual. El movimiento automático y los halos llamativos son inconsistencias de acabado. Las ilustraciones pueden conservar su lenguaje técnico en reposo y los cambios de estado deben respetar la preferencia de movimiento reducido.

## Shapes

Píldoras para acciones, esquinas redondeadas en tarjetas y campos e iconos de trazo sencillo. El isotipo conserva su forma y sus colores originales.

## Components

- **Cabecera y pie.** Isotipo y nombre visibles. Los enlaces representan Inicio, Servicios, Proyectos, Blog y Nosotros. El contacto usa una acción identificable y el pie replica rutas útiles.
- **Botones.** Primario en carbón, secundario en blanco y contacto en azul. Todos comparten un foco visible y área de interacción suficiente. El formulario explica la apertura de WhatsApp antes de la acción.
- **Tarjetas.** Servicios con icono, título y descripción. Las guías y los artículos conservan su imagen de portada en el inicio, los listados y la ficha. La firma puede sustituir cada imagen desde el campo `heroImage` de la entrada. La sección «¿Quiénes Somos?» conserva su propia ilustración. La vista previa social predeterminada usa el isotipo original en una imagen de 1200 × 630 px.
- **Formulario.** Campos claros con borde visible, etiquetas permanentes e instrucciones junto a la acción. Los datos permanecen en la página hasta que el usuario decide compartir su solicitud.

## Do's and Don'ts

- Preservar el isotipo, los tonos identificativos, la retícula y la iconografía técnica existente.
- Usar los colores de marca de acuerdo con el contraste de cada superficie.
- Priorizar la lectura, el destino de cada enlace y la continuidad entre servicios, contenido técnico y contacto.

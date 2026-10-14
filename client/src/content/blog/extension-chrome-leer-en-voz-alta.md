---
title: "AutoRead: una extensión para escuchar cualquier texto sin que suene a robot"
description: "Seleccionas un texto, presionas Leer y lo escuchas con una voz natural. Cómo funciona por dentro y cómo llevamos la misma idea al botón Escuchar de este blog."
date: 2026-10-14
category: herramientas
tags: ["Chrome", "JavaScript", "Accesibilidad", "Texto a voz", "Código abierto"]
summary: ["Leer en pantalla todo el día cansa. Escuchar permite revisar respuestas largas de IA, artículos o informes con la vista descansada.", "AutoRead es una extensión de Chrome de código abierto que lee el texto que selecciones. Antes de leerlo lo limpia y lo divide por párrafos para que suene natural.", "La misma idea está en el botón Escuchar de cada artículo de este blog. Para textos confidenciales, conviene usar las voces locales del computador."]
repo: https://github.com/rodolflying/TextToSpeech-ChromeExtension
original: {"url": "https://medium.com/@rodolfo.antonio.sep/autoread-pro-building-a-smarter-chrome-extension-to-listen-to-ai-responses-cae9c7cd630e", "date": "2026-03-31"}
---

Paso buena parte del día leyendo respuestas largas de asistentes de IA, documentación y artículos. En 2023 escribí una primera extensión para que el navegador me leyera en voz alta las respuestas de ChatGPT. Con textos cortos funcionaba. Con los largos sonaba mal: leía los enlaces letra por letra, se trababa con las viñetas y cortaba la entonación en cada coma.

[AutoRead](https://github.com/rodolflying/TextToSpeech-ChromeExtension) es la versión que reescribí en 2026 con una sola meta: no hacer más cosas, sino hablar mejor. Este artículo explica cómo está hecha y qué decisiones hacen la diferencia. Al final verás que la misma idea quedó integrada en este blog: si prefieres escuchar este texto en vez de leerlo, usa el botón **Escuchar artículo** de arriba.

## Cómo se usa

1. Selecciona un texto en cualquier página.
2. Abre AutoRead desde la barra de extensiones.
3. Elige la voz, o déjala en automático, y la velocidad, entre 0,5x y 3x.
4. Presiona **Leer**. Puedes detenerla cuando quieras.

La voz y la velocidad quedan guardadas para la próxima vez.

## Cómo está hecha

Es una extensión de Chrome con Manifest V3, el formato actual de extensiones. Tiene tres piezas, cada una con una sola tarea:

- **El panel** (`popup.html` y `popup.js`): los controles de voz, velocidad, leer y detener.
- **El service worker** (`background.js`): obtiene el texto seleccionado con `chrome.scripting`, lo prepara y se lo entrega al motor de voz del navegador con `chrome.tts`.
- **El manifiesto** (`manifest.json`): declara los permisos que necesita, que son `activeTab`, `scripting`, `storage` y `tts`.

Cuando la voz está en automático, detecta el idioma del texto con `chrome.i18n.detectLanguage` y elige una voz de ese idioma. Las preferencias se guardan con `chrome.storage.local`.

## Tres decisiones para que no suene a robot

### 1. Limpiar el texto antes de leerlo

El texto copiado de una página trae ruido que un motor de voz lee tal cual: direcciones web, viñetas, saltos de línea y espacios de más. Una limpieza mínima cambia mucho la experiencia:

```javascript title="limpiar.js"
function limpiarParaLeer(texto) {
  return texto
    .replace(/­/g, '')                // guiones invisibles de partición
    .replace(/https?:\/\/\S+/g, 'enlace')  // nadie quiere oír una URL letra por letra
    .replace(/^[•\-*]\s+/gm, ', ')         // las viñetas se vuelven pausas breves
    .replace(/[ \t]+/g, ' ')
    .trim();
}
```

Los saltos de línea se conservan a propósito: marcan dónde termina cada párrafo, y eso se usa en el paso siguiente.

### 2. Dividir por párrafos, no por comas

Un motor de voz decide la entonación según el fragmento que recibe. Si le entregas el texto cortado en cada coma, cada pedazo suena como una frase aparte, con la voz subiendo y bajando sin sentido. Si le entregas el párrafo completo, la entonación acompaña la idea.

AutoRead envía un párrafo a la vez. Solo si un párrafo supera los 1.500 caracteres lo divide en oraciones:

```javascript title="trozos.js"
function enTrozos(texto, maximo = 1500) {
  return texto
    .split(/\n+/)                          // un trozo por párrafo
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) => (p.length <= maximo ? [p] : p.match(/[^.!?]+[.!?]*/g).map((s) => s.trim())));
}
```

Los trozos se leen en orden: cuando el motor avisa que terminó uno, empieza el siguiente. Así nunca se superponen y detener la lectura es inmediato.

### 3. La voz correcta para el idioma

Una voz en inglés leyendo español suena peor que cualquier robot. Por eso el modo automático detecta el idioma antes de elegir la voz.

Hay un detalle que importa en una empresa. Las voces disponibles son de dos tipos. Las **locales** vienen con el sistema operativo y convierten el texto en audio dentro del computador. Las **en línea**, como las de Google en Chrome o las voces "Natural" de Edge, suenan mejor, pero el texto viaja a los servidores del proveedor para convertirse en audio. Para un artículo público da lo mismo. Para un contrato o un informe interno, conviene elegir una voz local.

## La misma idea, integrada en este blog

Cada artículo de este blog tiene un botón **Escuchar artículo**. Una página web no puede usar `chrome.tts`, que es exclusivo de las extensiones, así que usa la [Web Speech API](https://developer.mozilla.org/es/docs/Web/API/Web_Speech_API), que viene en los navegadores modernos. Las reglas son las mismas: limpiar el texto, leer por bloques (títulos, párrafos y elementos de lista) y preferir una voz en español. Los bloques de código se anuncian, pero no se leen, y el párrafo que se está leyendo queda destacado para que puedas seguirlo con la vista.

Aprendimos una cosa más en el camino. En Chrome, algunas voces en línea pueden cortarse cuando un fragmento es muy largo. Por eso aquí los párrafos largos se agrupan en oraciones de hasta unos 220 caracteres, sin cortar nunca una oración por la mitad. El núcleo cabe en pocas líneas:

```javascript title="escuchar.js"
function leer(trozos, voz, i = 0) {
  if (i >= trozos.length) return;
  const frase = new SpeechSynthesisUtterance(trozos[i]);
  frase.lang = voz?.lang ?? 'es-CL';
  if (voz) frase.voice = voz;
  frase.onend = () => leer(trozos, voz, i + 1);  // el siguiente trozo empieza al terminar este
  speechSynthesis.speak(frase);
}
```

Las voces cargan de forma asíncrona: la primera llamada a `speechSynthesis.getVoices()` puede venir vacía. Hay que escuchar el evento `voiceschanged` antes de elegir una.

## Para qué sirve en una empresa

- **Accesibilidad.** Para personas con baja visión, dislexia o fatiga visual, escuchar es la diferencia entre leer un documento largo o dejarlo para después.
- **Revisar mejor.** Escuchar un informe mientras sigues el texto ayuda a encontrar errores que la vista se salta, porque el oído no completa palabras como lo hace el ojo.
- **Manuales y procedimientos.** Un procedimiento que se puede escuchar llega a quien no tiene tiempo de sentarse a leerlo.

No requiere licencias ni servicios externos: la voz ya está en el navegador. Agregar un botón de escuchar a una intranet, un visor de reportes o un sistema interno es poco trabajo y le sirve a todo el equipo.

## Cómo instalarla

AutoRead no está en la tienda de Chrome. Se instala desde el código:

1. Descarga o clona el [repositorio](https://github.com/rodolflying/TextToSpeech-ChromeExtension).
2. Abre `chrome://extensions` y activa el **Modo de desarrollador**.
3. Presiona **Cargar descomprimida** y elige la carpeta del proyecto.
4. Fíjala en la barra con el ícono de la pieza de rompecabezas.

En Edge (`edge://extensions`) y Brave (`brave://extensions`) los pasos son los mismos.

Si la usas y se te ocurre una mejora, abre un issue o haz un fork. Así creció [GPT_scraper](/blog/integrar-sistemas-sin-api).

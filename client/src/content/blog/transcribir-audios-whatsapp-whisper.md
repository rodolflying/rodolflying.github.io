---
title: "Transcribe audios de WhatsApp gratis y sin subirlos a internet"
description: "Con Whisper y unas pocas líneas de Python, los audios de tu equipo se convierten en texto en tu propio computador, sin costo por minuto y sin que la información salga de la empresa."
date: 2026-10-14
category: ia-datos
tags: ["IA", "Whisper", "Python", "Transcripción", "Privacidad"]
summary: ["Whisper es un modelo abierto de reconocimiento de voz. Corre en un computador normal, sin conexión y sin costo por minuto.", "Los audios no salen de tu equipo, así que sirve para reuniones, entrevistas o reportes de terreno con información sensible.", "El texto queda listo para buscar, resumir o cargar en un sistema. Así, el técnico que reporta por audio deja su registro escrito sin teclear."]
original: {"url": "https://medium.com/@rodolfo.antonio.sep/build-a-free-audio-transcription-ai-app-in-30-minutes-with-python-581f37ede8ab", "date": "2025-02-14"}
---

En muchas empresas el reporte de terreno llega por WhatsApp, y en audio. Es lo más rápido para quien está con las manos ocupadas, pero lo más lento para quien recibe: hay que escucharlo entero, no se puede buscar y no queda en ningún sistema. Lo mismo pasa con las reuniones, las entrevistas y las clases.

Transcribir esos audios ya no requiere pagar un servicio por minuto ni subir conversaciones internas a la nube. [Whisper](https://github.com/openai/whisper), el modelo de reconocimiento de voz que OpenAI publicó como código abierto, corre en un computador de oficina y entiende bien el español. En este artículo te mostramos cómo usarlo con un script corto que probamos antes de publicar.

## Por qué local y no un servicio en la nube

Hay servicios que transcriben muy bien. La pregunta es qué estás dispuesto a enviarles. Un audio de terreno puede mencionar fallas, nombres, clientes o montos. Una reunión de gerencia, todavía más. Con Whisper en tu equipo:

- **El audio no sale de tu computador.** Solo la primera vez se descarga el modelo; después funciona sin internet.
- **No hay costo por minuto.** Transcribir diez audios o diez mil cuesta lo mismo: el tiempo del computador.
- **No dependes de una cuenta ni de un proveedor** que cambie precios o condiciones.

El costo es la velocidad. En un computador sin tarjeta gráfica, un audio de un par de minutos tarda segundos o minutos según el modelo que elijas. Para la mayoría de los usos, eso basta.

## Lo que necesitas

Usamos [faster-whisper](https://github.com/SYSTRAN/faster-whisper), una implementación de Whisper más rápida y liviana que la original. Tiene una ventaja práctica: decodifica el audio con PyAV, que trae incluido lo necesario, así que **no tienes que instalar FFmpeg**. Lee directamente los `.ogg` y `.opus` de las notas de voz de WhatsApp, además de `.mp3`, `.m4a` y `.wav`.

Crea un entorno virtual e instala la librería:

```bash
python -m venv .venv
source .venv/bin/activate    # en Windows: .venv\Scripts\activate
pip install faster-whisper
```

## El script

Pon los audios en una carpeta llamada `audios`. El script los recorre en orden alfabético, transcribe cada uno y deja todo en un solo archivo de texto:

```python title="transcribir.py"
from pathlib import Path

from faster_whisper import WhisperModel

CARPETA = Path("audios")             # .ogg/.opus de WhatsApp, .mp3, .m4a, .wav...
SALIDA = Path("transcripciones.md")

modelo = WhisperModel("small", device="cpu", compute_type="int8")

with SALIDA.open("w", encoding="utf-8") as f:
    for audio in sorted(p for p in CARPETA.iterdir() if p.is_file()):
        segmentos, info = modelo.transcribe(str(audio), vad_filter=True)
        texto = " ".join(s.text.strip() for s in segmentos)
        f.write(f"## {audio.name} ({info.language})\n\n{texto}\n\n")
        print(f"Listo: {audio.name}")
```

Tres detalles que importan:

- `compute_type="int8"` reduce la memoria y acelera el trabajo en procesador, con una pérdida de calidad que en la práctica no se nota.
- `vad_filter=True` salta los silencios antes de transcribir. En audios de terreno, con pausas y ruido, evita frases inventadas en los tramos sin voz.
- El idioma se detecta solo y queda en `info.language`. Si todos tus audios son en español, puedes fijarlo con `language="es"` y ganar un poco de velocidad.

Lo probamos con dos audios: un reporte de terreno en `.wav` y los acuerdos de una reunión en `.ogg`, el formato de WhatsApp. Este fue el resultado, sin corregir nada:

```text title="transcripciones.md"
## 01-reporte-terreno.wav (es)

Hola, te cuento cómo quedó la bomba del sector norte. Cambiamos el sello mecánico y quedó funcionando a las 4 de la tarde. Mañana hay que revisar la vibración.

## 02-reunion.ogg (es)

Acordamos tres cosas. Primero, el informe sale el viernes. Segundo, Carla revisa los costos. Tercero, la próxima reunión es el martes.
```

Si necesitas saber en qué minuto se dijo algo, cada segmento trae su inicio y su fin en segundos (`s.start` y `s.end`). Puedes escribir una línea por segmento en vez de unirlos.

## Qué modelo elegir

El primer argumento de `WhisperModel` es el tamaño del modelo. Más grande es más preciso y más lento:

| Modelo | Peso aproximado | Cuándo usarlo |
|---|---|---|
| `tiny`, `base` | 75 MB y 150 MB | Pruebas rápidas o computadores muy modestos |
| `small` | 500 MB | Buen equilibrio para español en un computador de oficina |
| `medium` | 1,5 GB | Audios difíciles: ruido, acentos marcados, términos técnicos |
| `turbo` | 1,6 GB | Casi la calidad del más grande, bastante más rápido; ideal con tarjeta gráfica |
| `large-v3` | 3 GB | La máxima precisión, si el tiempo no importa |

Si tienes una tarjeta gráfica NVIDIA, cambia a `device="cuda"` y `compute_type="float16"`. La diferencia de velocidad es grande.

## Del script al proceso

El script resuelve el caso de una persona con una carpeta de audios. En una empresa, lo valioso es que la transcripción llegue sola a donde se usa:

- **Una carpeta compartida o un buzón de correo** donde el equipo deja los audios, y una tarea que los transcribe cada pocos minutos.
- **Un resumen con los acuerdos y los pendientes**, preparado por un modelo de lenguaje que también puede correr en tu servidor.
- **El texto cargado en el sistema que corresponde**: la orden de trabajo, la ficha del cliente o el acta de la reunión.

Ahí la transcripción deja de ser un truco y se convierte en un registro: el técnico sigue reportando por audio, como le acomoda, y la jefatura tiene el texto listo para buscar y decidir.

Si en tu equipo los reportes llegan por audio y se pierden en el chat, cuéntanos cómo se hace hoy.

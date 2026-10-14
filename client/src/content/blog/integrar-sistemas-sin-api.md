---
title: "Cuando el sistema no tiene API: dos caminos que aprendimos con GPT_scraper"
description: "Un script para respaldar conversaciones de ChatGPT llegó a 139 estrellas en GitHub. Lo que enseñó sirve para integrar portales y sistemas que no ofrecen API."
date: 2026-10-14
category: integraciones
tags: ["Integraciones", "Python", "Web scraping", "Selenium", "Código abierto"]
summary: ["Muchos sistemas que usa una empresa, como portales de proveedores, plataformas antiguas o sitios del Estado, no tienen API. Aun así, su página web conversa con un servidor.", "Hay dos formas de automatizarlos: llamar a los mismos servicios que usa la web o manejar un navegador como lo haría una persona. La primera es más rápida y estable; la segunda funciona casi siempre.", "Antes de elegir, busca una exportación oficial o el permiso del dueño del sistema. Es lo más barato de mantener y lo único que no te expone legalmente."]
repo: https://github.com/rodolflying/GPT_scraper
original: {"url": "https://medium.com/@rodolfo.antonio.sep/scraping-all-your-conversations-with-chatgpt-made-easy-with-gpt-scrape-51da8fb97911", "date": "2023-03-25"}
---

En marzo de 2023 ChatGPT no tenía un botón para descargar tu historial. Yo lo usaba a diario y quería buscar, ordenar y analizar mis conversaciones, pero no había cómo sacarlas. Así nació [GPT_scraper](https://github.com/rodolflying/GPT_scraper), un par de scripts en Python que extraían el historial completo por dos caminos distintos.

El repositorio tiene hoy 139 estrellas y 12 forks en GitHub. No es por el código, que era sencillo. Es porque mucha gente tenía el mismo problema: **sus datos estaban ahí, pero sin una salida**.

Ese problema es exactamente el que vemos en las empresas. El portal del proveedor muestra las órdenes pero no las exporta. La plataforma antigua guarda años de historia y nadie sabe cómo sacarla. El sitio del Estado obliga a descargar documento por documento. Lo que aprendimos con GPT_scraper se aplica tal cual.

## La idea clave: toda página web conversa con un servidor

Una aplicación web moderna no trae los datos escritos en la página. El navegador los pide a un servidor, casi siempre en formato JSON, y después los dibuja. Puedes verlo tú mismo: abre las herramientas de desarrollo del navegador (F12), ve a la pestaña **Network** o **Red**, filtra por **Fetch/XHR** y recarga la página. Cada línea es una de esas conversaciones.

De ahí salen los dos caminos.

## Camino 1: llamar a los mismos servicios que usa la web

Si la página pide los datos a una dirección, tu programa puede pedirlos a la misma dirección con tu sesión. En GPT_scraper había dos llamadas: una que listaba las conversaciones por páginas de 100 y otra que traía cada conversación completa a partir de su identificador.

El procedimiento es siempre parecido:

1. Encuentra en la pestaña Network la llamada que trae lo que necesitas.
2. Cópiala con clic derecho, **Copy as cURL**, y pruébala en una herramienta como Postman o Insomnia.
3. Identifica qué cabeceras identifican tu sesión y cómo funciona la paginación.
4. Reprodúcela en Python con `requests`.

Revisando el código para este artículo encontramos un error de paginación en la versión original. Después de la primera página sumaba 101 al desplazamiento en vez de 100, así que se saltaba una conversación. Así se recorre una lista paginada sin ese problema:

```python title="paginacion.py"
import random
import time

import requests


def traer_todo(session: requests.Session, url: str, por_pagina: int = 100) -> list[dict]:
    """Recorre un servicio paginado con offset y limit hasta la última página."""
    items, offset = [], 0
    while True:
        r = session.get(url, params={"offset": offset, "limit": por_pagina}, timeout=30)
        r.raise_for_status()
        pagina = r.json()["items"]
        items.extend(pagina)
        if len(pagina) < por_pagina:
            return items
        offset += por_pagina
        time.sleep(random.uniform(2, 5))  # ritmo de persona, no de ataque
```

La `session` lleva las cabeceras de tu propia sesión, las mismas que copiaste del navegador. La pausa aleatoria entre páginas no es un detalle. GPT_scraper esperaba de 2 a 5 segundos entre conversaciones para no ser bloqueado, y la versión con navegador sí llegó a ser bloqueada por pedir demasiado.

**A favor:** es rápido, entrega datos ordenados y no depende del diseño de la página. Si cambian los colores o mueven un botón, sigue funcionando.

**En contra:** esos servicios no están documentados y pueden cambiar sin aviso. La sesión expira, y hay que respetar los límites de velocidad y los términos de uso del sistema.

## Camino 2: manejar un navegador como lo haría una persona

Cuando no hay una llamada clara que reproducir, queda el navegador. Herramientas como [Selenium](https://www.selenium.dev/) o [Playwright](https://playwright.dev/python/) abren Chrome, inician sesión, hacen clic, llenan formularios y leen lo que aparece en pantalla. El segundo script de GPT_scraper hacía eso: abría cada conversación y copiaba el texto.

Es la misma técnica de nuestro [bot que declara el F29 en el SII](/blog/declarar-f29-sin-movimiento-automatico). Ahí no hay datos que leer, sino un trámite que hacer: elegir el período, confirmar y guardar el folio.

**A favor:** funciona casi siempre, porque hace lo mismo que una persona. Sirve para formularios, descargas de PDF y páginas que se arman en el servidor.

**En contra:** es más lento y se rompe cuando cambia el diseño de la página. Además, necesita esperas bien hechas y avisos cuando algo falla.

## Cómo elegimos en un proyecto

Antes de escribir una línea de código, recorremos estas opciones en orden. Cada una cuesta más de mantener que la anterior:

| Opción | Cuándo usarla | Mantención |
|---|---|---|
| API oficial o integración del proveedor | Siempre que exista, aunque sea de pago | Baja |
| Exportación o reporte que ya envía el sistema | Si el sistema exporta a Excel o CSV, o manda un reporte por correo | Baja |
| Servicios internos de la web | Con permiso del dueño del sistema, cuando importan el volumen y la velocidad | Media |
| Navegador automatizado | Cuando no queda otra, o el proceso es llenar formularios | Media a alta |

La segunda fila es la más subestimada. Muchas veces el sistema ya envía un reporte diario por correo que nadie aprovecha, y automatizar su lectura es lo más barato y lo más estable.

## Lo que no hay que hacer

- **Entrar con credenciales ajenas o saltarse protecciones.** En Chile, la [Ley 21.459](https://www.bcn.cl/leychile/navegar?idNorma=1177743) sanciona a quien accede a un sistema "sin autorización o excediendo la autorización que posea" superando barreras técnicas. Se automatiza con tu cuenta, sobre tus datos y con permiso de quien administra el sistema.
- **Ignorar los términos de uso.** Muchos servicios prohíben el acceso automatizado a su aplicación web. GPT_scraper solo usaba tu cuenta y tus conversaciones. Aun así, hoy existe una forma oficial, y es la que corresponde usar.
- **Saturar el servidor.** Pausas, horarios de baja carga y guardar lo que ya descargaste para no pedirlo dos veces.
- **Dejar contraseñas o tokens en el código.** Van en variables de entorno o en un gestor de secretos, nunca en el repositorio.

## Qué pasó con GPT_scraper

ChatGPT agregó poco después una exportación oficial, se mudó a chatgpt.com y sus servicios internos cambiaron. Hoy, para respaldar tu historial, el camino correcto es el oficial: **Settings → Data controls → Export data**. OpenAI te envía un enlace para descargar un archivo ZIP ([guía de OpenAI](https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data)).

El repositorio probablemente ya no funcione tal cual, y lo dejamos como material de estudio. Sus dos caminos siguen siendo la forma más clara de explicar cómo integrar un sistema que no fue pensado para integrarse.

Si en tu empresa alguien saca datos de un sistema copiando y pegando, ese sistema casi seguro tiene uno de estos dos caminos. Encontrar el correcto es la primera parte de nuestro diagnóstico.

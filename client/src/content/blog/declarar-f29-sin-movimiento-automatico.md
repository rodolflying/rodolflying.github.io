---
title: "F29 sin movimiento: cómo automatizarlo para no volver a pagar una multa por olvido"
description: "Aunque tu empresa no tenga actividad, el SII exige el F29 todos los meses. Así lo automatizamos con Python y esto le falta a un script para quedar en producción."
date: 2026-10-14
category: automatizacion
tags: ["SII", "F29", "Python", "Selenium", "Pymes"]
summary: ["Toda empresa afecta a IVA debe presentar el F29 cada mes, aunque no haya vendido ni comprado nada.", "Sin movimiento y por internet, el plazo vence el día 28 del mes siguiente. Si se pasa, la multa parte en 1 UTM.", "Un bot puede presentarlo, guardar el folio y avisar si algo falla. Lo difícil no es hacer clic: es tener la certeza de que quedó hecho."]
repo: https://github.com/rodolflying/sii_bot
original: {"url": "https://medium.com/@rodolfo.antonio.sep/%EF%B8%8F-automatiza-la-declaraci%C3%B3n-f29-sin-movimientos-en-chile-con-python-y-selenium-d3739db8dfe4", "date": "2025-04-11"}
---

Tener una SpA sin actividad parece no dar trabajo, hasta que llega la multa. El SII exige el Formulario 29 todos los meses, aunque la empresa no haya emitido una sola factura. A mí se me pasó dos veces y pagué las dos multas. No fue por descuido grave: es un trámite de dos minutos que se olvida justamente porque no pasa nada.

Por eso escribí [sii_bot](https://github.com/rodolflying/sii_bot), un script en Python que entra al portal del SII, declara el mes sin movimiento y guarda el folio. En este artículo explico qué exige la ley, cómo funciona el bot y, sobre todo, qué le falta a un script que "funciona en mi computador" para que una empresa pueda confiar en él.

## Qué exige el SII

El F29 es la declaración mensual de IVA. Según el SII, quienes están afectos a IVA deben presentarlo desde el mes en que inician actividades, [aun cuando no tengan operaciones](https://www.sii.cl/como_se_hace_para/declarar_imp_mensuales/Declarar_Iva.pdf). Si no hubo ventas ni compras, se declara "sin movimiento".

Los plazos dependen de cómo y qué declares:

| Situación | Plazo |
|---|---|
| Regla general | Día 12 del mes siguiente |
| Facturador electrónico que declara y paga por internet | Día 20 del mes siguiente |
| Declaración sin movimiento o sin pago, por internet | Día 28 del mes siguiente |

Si el último día cae en sábado, domingo, feriado o 31 de diciembre, el plazo se corre al día hábil siguiente ([SII, plazos del F29](https://www.sii.cl/portales/mipyme/f29/)). La declaración sin movimiento no se puede presentar en papel.

¿Y si se te pasa? El artículo 97 N°2 del Código Tributario sanciona las declaraciones que no implican un pago inmediato y se presentan fuera de plazo con una multa de **1 UTM a 1 UTA** ([texto en LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=6374)). Es poco dinero comparado con una empresa en operación, pero es plata pagada por nada.

> **Ojo con dos detalles.** Si tu empresa sí tuvo movimiento y lo declaras "sin movimiento", tendrás que rectificar y pagar multas e intereses sobre el impuesto que correspondía. Y estar sin movimiento no te libera de la Operación Renta: según el [SII](https://www.sii.cl/preguntas_frecuentes/declaracion_renta/001_140_2247.htm), incluso tras más de 24 meses sin movimiento hay que preparar el balance y declarar la renta anual.

## Qué hace el bot, paso a paso

El flujo es exactamente el que harías tú en el navegador, pero sin que tengas que acordarte:

1. Inicia sesión en el SII con el RUT y la clave de la empresa, que lee desde un archivo `.env`.
2. Abre la declaración del F29 y elige el período anterior: si hoy es octubre, declara septiembre.
3. Marca la declaración sin movimiento y confirma el envío.
4. Busca el folio en la consulta de declaraciones del SII.
5. Anota el período, la fecha y el folio en un CSV, que queda como registro.

Usa [Selenium](https://www.selenium.dev/) para manejar Chrome como lo haría una persona. Es la opción natural cuando el portal no ofrece una API para hacer el trámite, y es la misma técnica que usamos para otros trámites del portal en el [caso de bots para el SII](/projects).

Calcular el período parece trivial, pero tiene su trampa. La primera versión usaba `locale` y `strftime("%B")` para obtener el nombre del mes en español. Eso depende de que el sistema tenga instalado el idioma español, y en muchos servidores no está: el script falla antes de empezar. Una tabla propia evita el problema:

```python title="periodo.py"
from datetime import date

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def periodo_anterior(hoy: date) -> tuple[str, int]:
    """Mes y año que se declaran: siempre el mes anterior al actual."""
    if hoy.month == 1:
        return MESES[11], hoy.year - 1
    return MESES[hoy.month - 2], hoy.year


print(periodo_anterior(date(2026, 1, 8)))   # ('diciembre', 2025)
print(periodo_anterior(date(2026, 10, 14)))  # ('septiembre', 2026)
```

## De script a proceso: lo que cambiaríamos

La versión publicada en GitHub resuelve mi caso: un computador, una empresa y yo mirando la pantalla. Para que una empresa lo deje corriendo sin mirar, hay que resolver cinco cosas más. Estas son las que revisamos en cualquier automatización antes de darla por terminada.

### 1. Esperar a que la página esté lista, no un tiempo fijo

El script original espera segundos fijos entre pasos (`countdown(5)`, `countdown(7)`). Si el SII está lento ese día, el clic llega antes que el botón y todo falla. Si está rápido, pierdes tiempo. Selenium permite esperar hasta que el elemento esté disponible:

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def clic(driver, selector: str, segundos: int = 30) -> None:
    """Hace clic apenas el botón se puede usar, con un máximo de espera."""
    boton = WebDriverWait(driver, segundos).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
    )
    boton.click()
```

### 2. Selectores que sobrevivan a un cambio de diseño

Rutas como `/html/body/div[1]/div/div/div/div[3]/button[2]` se rompen con cualquier ajuste en la página. Conviene buscar elementos por su `id`, por su etiqueta o por el texto del botón, que cambian mucho menos que la estructura.

### 3. Saber si ya está hecho antes de hacerlo

En la primera versión, si el envío fallaba el script imprimía "este mes ya fue declarado o ocurrió un error". Son dos situaciones muy distintas: una es éxito y la otra exige actuar. Un proceso confiable revisa antes de actuar y verifica después:

```python
import csv
from pathlib import Path

REGISTRO = Path("declaraciones/meses_declarados.csv")


def ya_declarado(periodo: str) -> bool:
    """True si el período ya tiene folio en el registro."""
    if not REGISTRO.exists():
        return False
    with REGISTRO.open(newline="", encoding="utf-8") as f:
        return any(fila["periodo"] == periodo and fila["folio"] for fila in csv.DictReader(f))
```

Con esa función el bot puede correr todos los días sin riesgo: si el mes ya tiene folio, no hace nada. Después de enviar, consulta el folio en el SII. Si no lo encuentra, no lo da por hecho: avisa.

### 4. Evidencia que no se pueda confundir

Revisando el código para este artículo encontramos un error que vale como lección. El paso que descarga el certificado en PDF quedó comentado, pero la función que renombra "el último PDF de la carpeta" sigue activa. Si la carpeta tiene el PDF del mes anterior, lo renombra como si fuera el actual. La regla es simple: nunca supongas qué se descargó. Verifica el nombre, la fecha y, si se puede, el contenido.

### 5. Un calendario y alguien que reciba el aviso

Un script que corre solo cuando te acuerdas de abrirlo tiene el mismo problema que la declaración manual. En un servidor Linux basta una línea de `cron` (en Windows, el Programador de tareas):

```bash
# Todos los días a las 9:00, del 5 al 25 de cada mes
0 9 5-25 * * /opt/sii_bot/.venv/bin/python /opt/sii_bot/main.py
```

Como el bot revisa antes de actuar, correr todos los días no duplica nada: el primer día declara y los siguientes solo confirman. Si el día 25 todavía no hay folio, quedan tres días para resolverlo a mano antes del 28. Cada resultado (el folio o el error) debería llegar a quien corresponde, por correo o por un grupo de Telegram.

La clave tributaria merece su propio cuidado. Un `.env` en un notebook sirve para probar. En producción la clave vive en el servidor, fuera del repositorio y con acceso restringido.

## Cuándo conviene y cuándo no

Conviene para sociedades sin actividad: SpA recién creadas, sociedades de inversión, empresas en pausa o un contador que lleva varias de ellas. Para varias empresas, el mismo bot recorre una lista de RUT.

No conviene declarar sin movimiento de forma automática si la empresa tiene movimiento. Ahí el F29 lleva montos reales y el camino es otro: la propuesta de declaración que arma el SII con el Registro de Compras y Ventas. Una automatización puede prepararla y revisar las diferencias, pero la aprobación final la da una persona. Así trabajamos en Star Apps: la máquina hace el trabajo repetitivo y tu equipo revisa, aprueba y decide.

El código está en [GitHub](https://github.com/rodolflying/sii_bot). Si quieres que corra en un servidor, con avisos y para varias empresas, conversemos.

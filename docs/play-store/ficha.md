# Ficha de Google Play — "Un paso a la vez"

Textos listos para pegar en Play Console (Fase 11g). Siguen la guía
editorial (`docs/guia-editorial.md`): tuteo neutro, nada de clichés de taza,
positividad tóxica ni promesas. Si se cambia algo acá, cambiarlo también en
Play Console (y al revés).

Package: `com.erickleal.reflexiondiaria` (permanente).

## Datos de la app (Crear app)

| Campo | Valor |
|---|---|
| Nombre de la app | Un paso a la vez |
| Idioma predeterminado | Español (Latinoamérica) – es-419 |
| App o juego | App |
| Gratis o de pago | Gratis |

## Ficha principal de Play Store

**Nombre (máx. 30):** `Un paso a la vez`

**Descripción breve (máx. 80; esta tiene 76):**

```
Una frase, una reflexión breve y una acción pequeña para hacer hoy. Sin más.
```

**Descripción completa (máx. 4000):**

```
Un paso a la vez te propone cada día tres cosas cortas:

• Una frase para empezar.
• Una reflexión breve, que se lee en menos de un minuto.
• Una acción pequeña y concreta para hacer hoy.

No es una app de frases bonitas para guardar. La idea es que cada día puedas hacer algo: escribirle a alguien, ordenar un rincón, decir que no a una cosa, salir cinco minutos a caminar. Pasos chicos, que se pueden hacer en un día cualquiera.

Lo que puedes hacer en la app:

• Marcar «Lo hice» cuando cumples la acción del día, y llevar un diario con tus propias notas.
• Ver tu mes en un calendario: qué días hiciste la acción y cuáles guardaste.
• Guardar en favoritos los días que quieras volver a leer.
• Compartir la frase y la acción como imagen, lista para tus historias.
• Recibir un recordatorio por la mañana y otro por la noche. El de la noche no suena si ya marcaste que lo hiciste.
• Usarla en modo claro u oscuro.

Sin cuentas y sin rachas: no necesitas registrarte, y nada te reprocha si un día no la abres. Todo el contenido es original y lo revisa una persona antes de publicarse.

Tus datos son tuyos: tus favoritos y tu diario van ligados a un código anónimo, no a tu nombre ni a tu correo, y puedes borrarlos cuando quieras desde Ajustes.

Esta app no reemplaza la ayuda profesional. Si estás pasando por un momento difícil, pedir ayuda también es un paso.
```

**Gráficos** (en esta carpeta, generados con `scripts/generate_app_icon.py`):

- Ícono de la app 512 × 512: `icon-512.png`
- Gráfico de funciones 1024 × 500: `feature-graphic.png`
- Capturas de teléfono: ver "Capturas" abajo.

## Configuración de la tienda

| Campo | Valor |
|---|---|
| Categoría | Estilo de vida |
| Etiquetas | Autoayuda / Desarrollo personal (las que ofrezca Play más cercanas) |
| Correo de contacto | eleal.escobar@gmail.com |
| Sitio web | (vacío) |
| Política de privacidad | https://reflexion-diaria-production.up.railway.app/privacy |

Por qué "Estilo de vida" y no "Salud y bienestar": la app no da consejos de
salud, y esa categoría hace que Play revise con más detalle las
afirmaciones de salud.

## Contenido de la app (Política → Contenido de la app)

- **Acceso a la app:** "Todas las funciones están disponibles sin acceso
  especial" (no hay login).
- **Anuncios:** No contiene anuncios.
- **Público objetivo:** 18 años o más. (Elegir menores de 13 activa la
  política de Familias; la app tampoco está pensada para niños.)
- **App de noticias:** No.
- **App gubernamental:** No.
- **Funciones financieras:** Ninguna.
- **Apps de salud:** Ninguna función de salud.

### Clasificación de contenido (cuestionario IARC)

- Correo: eleal.escobar@gmail.com. Categoría: **"Todos los demás tipos de
  apps"** (no es juego, ni red social, ni referencia).
- Violencia, sexo, lenguaje vulgar, drogas/alcohol/tabaco, apuestas,
  humor ofensivo: **No** a todo.
- ¿Los usuarios pueden interactuar o intercambiar contenido entre ellos?
  **No** (el diario es privado; compartir como imagen pasa por las apps
  del propio teléfono).
- **Contenido en línea** (contenido que no viene en la descarga): **Sí**,
  porque las reflexiones se cargan desde el servidor.
- ¿Comparte la ubicación del usuario con otros? **No.**
- ¿Permite compras digitales? ¿Recompensas/NFT? ¿Navegador? ¿Principalmente
  educativa? **No** a todo.
- Resultado (2026-11-25): **apto para todas las edades** (Brasil "L").

### Seguridad de los datos (Data safety)

Resumen de la política de privacidad. Si la app empieza a guardar o enviar
algo nuevo, actualizar las dos cosas.

**Preguntas generales**

| Pregunta | Respuesta |
|---|---|
| ¿Recopila o comparte alguno de los tipos de datos requeridos? | Sí |
| ¿Todos los datos se encriptan en tránsito? | Sí (HTTPS) |
| ¿Métodos de creación de cuentas? | La app no permite crear cuentas; tampoco se inicia sesión con cuentas externas |
| ¿Ofreces una forma de solicitar la eliminación de datos? | Sí. URL de eliminación: la misma `/privacy` (sección "Cómo borrar tus datos") |

**Tipos de datos recopilados** (ninguno se **comparte** con terceros;
Railway es proveedor de hosting, no cuenta como "compartir"):

| Tipo (categoría de Play) | Qué es en la app | ¿Opcional? | Propósito |
|---|---|---|---|
| Identificadores del dispositivo u otros → *Dispositivo u otros ID* | UUID anónimo generado por la app | No (necesario) | Funcionalidad de la app |
| Actividad en la app → *Otro contenido generado por el usuario* | Notas del diario | Sí | Funcionalidad de la app |
| Actividad en la app → *Otras acciones* | Favoritos y acciones marcadas como hechas | Sí | Funcionalidad de la app |

Para cada uno: **Recopilado: Sí · Compartido: No · Procesado de forma
efímera: No**.

**No se recopila:** nombre, correo, teléfono, ubicación, contactos, fotos,
archivos, información de salud, financiera, historial web, ni datos de
diagnóstico o fallos (no hay Sentry ni analítica).

## Capturas

Play acepta entre 2 y 8 capturas de teléfono, con la proporción del lado
largo como máximo **2 veces** el lado corto. Las del Xiaomi 10T salen
20:9 (2.22), así que no sirven tal cual. Las subidas (en `screenshots/`)
se procesaron así: recorte de la barra de estado y la de navegación,
relleno lateral estirando la columna del borde hasta 9:16, y escala a
1080 × 1920. Son: Hoy claro, Hoy oscuro, Compartir, Historial,
Favoritos, Ajustes (sacadas del APK de preview, misma UI).

**Declaración de recursos de IA** (paso de revisión de la ficha): "No
etiquetar recursos" (decisión de Erick: capturas reales, ícono/gráfico
geométricos por script, textos revisados por él).

## Prueba cerrada (Alpha)

Configurada el 2026-11-25: todos los países (177), lista de correos
**"Testers Versiculo Diario"** (43, reutilizada de Versículo), correo de
comentarios eleal.escobar@gmail.com, versión 2 (1.0.0). Enviada a revisión
junto con la ficha. Para pedir producción hace falta **≥12 testers
aceptados durante ≥14 días seguidos** (el requisito es por app, no por
cuenta).

## Notas de la versión (prueba interna y cerrada)

```
<es-419>
Primera versión: una frase, una reflexión y una acción para hoy, con diario, historial, favoritos, recordatorios y compartir como imagen.
</es-419>
```

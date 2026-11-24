# Reflexión Diaria

App móvil de frases motivacionales **originales**: una frase corta al día +
una reflexión breve + **una acción concreta para hoy**. Notificaciones
locales, compartir como imagen, favoritos, historial, diario personal, modo
oscuro. Panel admin web para gestionar y revisar contenido.

**Repo:** github.com/erick-leal/reflexion-diaria (monorepo pnpm workspaces).
**Proyecto hermano:** `../versiculo-diario` (misma arquitectura, ya publicado
en Google Play). Es la referencia para todo: antes de resolver algo de
cero, mirar cómo quedó resuelto allá y leer su `CLAUDE.md` (gotchas).
**Nunca modificar nada dentro de `versiculo-diario` desde este proyecto.**

## Cómo trabajar en este proyecto (leer antes de escribir código)

Erick es dev frontend (React/TS/Vite/Node/PostgreSQL/Railway). Versículo
Diario fue su primer proyecto mobile; este es el segundo. Actúa como Lead
Mobile Engineer/Architect/mentor técnico:

- **Trabajo iterativo por fases pequeñas.** En cada paso: (1) explicar qué
  se va a construir, (2) justificar por qué, (3) generar solo el código
  necesario, (4) esperar aprobación antes de seguir. No avanzar de fase
  sin cerrar la anterior de verdad.
- **Verificar en runtime antes de cerrar una fase**: que compile no basta.
  Hay que exportar con source-maps, golpear el endpoint real, etc.
- **Decisiones de arquitectura/producto → alternativas + recomendación
  justificada**, con preguntas explícitas cuando la decisión es de Erick.
  Lo técnico trivial y reversible: explicar en una línea y seguir.
- Explicar el "por qué" de lo mobile-específico (Expo Go vs dev builds,
  EAS, versionado de SDK, Play Console).
- En su PowerShell la política de ejecución bloquea `.ps1`: usar
  `pnpm.cmd`, `npm.cmd`, `npx.cmd`, `eas.cmd`.

## Decisiones de producto (con el porqué)

- **Contenido 100% original, escrito con IA + revisión humana obligatoria.**
  Nada de frases de terceros: ni libros, ni canciones, ni eslóganes, ni
  sitios de frases, ni "atribuidas a" celebridades. Citar al autor no
  protege del copyright, y las frases célebres atribuidas suelen ser
  apócrifas. Por eso **el modelo de datos no tiene campo `author`**: toda
  frase es de la voz editorial de la app. Si alguna vez aparece una
  atribución a un tercero, es un bug de contenido.
- **Revisión humana obligatoria**: estados `draft/ai_generated/reviewed/
  published` (igual que Versículo). Los endpoints públicos filtran
  `status == "published"`; si el filtro no está, es un bug de seguridad de
  contenido. La IA nunca publica sola.
- **Voz editorial: práctica / accionable.** La motivación genérica es un
  mercado saturado; el diferenciador es la voz. Cada día trae una frase
  breve, una reflexión corta y una **acción concreta y pequeña para hoy**
  ("hoy intenta…"). Tono cercano y honesto: nada de hustle culture,
  positividad tóxica ni frases de taza. La guía editorial detallada llega
  en la Fase 10.
- **Identidad anónima** (UUID en el dispositivo, header `X-Device-Id`),
  igual que en Versículo.
- **Nombre visible: "Un paso a la vez"** (propuesto por Erick el
  2026-11-24; antes era "Reflexión Diaria"). Va en `app.json` → `name` y
  en el título del admin. En una búsqueda rápida no apareció ninguna app
  con ese nombre en Google Play; **volver a buscar en la Play Store antes
  de publicar** (Fase 11). Lo interno **sigue llamándose
  `reflexion-diaria`**: repo, carpeta, `slug`, `scheme`, proyecto Railway y
  **package Android / bundle iOS `com.erickleal.reflexiondiaria`**. El
  package no se ve en la tienda y es permanente una vez publicado, así que
  no se toca.
- **Encabezado de Hoy:** saludo según la hora del teléfono (Buenos
  días/tardes/noches) + fecha, en vez de repetir el nombre de la app.
- **Infraestructura propia**: proyecto Railway nuevo y proyecto Firebase
  nuevo, sin compartir nada con Versículo Diario. Así un deploy o una
  migración de una app nunca afecta a la otra.

## Stack

- **Mobile** (`apps/mobile`): React Native 0.86 + Expo **SDK 57** +
  TypeScript, Expo Router, TanStack Query, StyleSheet. (Versículo sigue
  en SDK 54: no copiar versiones de dependencias desde allá.)
- **Admin** (`apps/admin`): React + Vite + TypeScript; Firebase Auth en la
  Fase 9.
- **Backend** (`backend/`): FastAPI + SQLAlchemy 2.0 + Alembic +
  PostgreSQL 18 (Railway, proyecto propio).
- **Compartido** (`packages/shared`, `@reflexion-diaria/shared`): tipos TS
  para mobile y admin.

## Gotchas heredados de Versículo Diario (ya aplicados, no revertir)

1. **`.npmrc` con `shamefully-hoist=true`**: Expo/RN asumen el hoisting
   clásico de npm.
2. **Metro con hierarchical lookup ACTIVO**: no poner
   `disableHierarchicalLookup = true`; con pnpm se rompe.
3. **Una sola copia de React**: el admin está fijado a la **misma versión
   exacta de React que pide el SDK de Expo** (hoy `19.2.3`, en `react` y
   `react-dom`), así que el lockfile tiene una sola versión. Si se sube el
   SDK, alinear también el admin a la versión que fije
   `npx expo install --fix`. Como red de seguridad, `metro.config.js`
   además fuerza `react`/`react-native` hacia `apps/mobile/node_modules`.
   Para verificarlo, en `apps/mobile` correr
   `npx expo export --platform android --source-maps`; en el `.map` debe
   aparecer UNA sola ruta `node_modules/react/index.js`.
4. **El SDK debe coincidir con el Expo Go del teléfono.** Expo Go solo
   abre proyectos de su mismo SDK y la Play Store lo actualiza sola. Por
   eso el proyecto pasó de SDK 54 a **57** en la Fase 4 (2026-11-24), en
   cuanto el Expo Go de Erick (Xiaomi 10T) se actualizó. Para subir de
   SDK: `pnpm add expo@~<versión>`, después `npx expo install --fix`,
   alinear React en el admin (#3), `pnpm dedupe` y `npx expo-doctor`
   (debe pasar todos los chequeos). **Detener Metro antes de instalar**:
   si está corriendo, el watcher se cae con `EBUSY`. Después, arrancar
   con `--clear` y escanear el QR de nuevo, sin usar "Recently opened"
   de Expo Go, que reabre la sesión vieja. En SDK 57 se quitó
   `resolver.unstable_enableSymlinks` del `metro.config.js`: ya viene
   activo por defecto y `expo-doctor` lo marca como un override
   peligroso.
   **Si Expo Go dice "the project you opened uses SDK 54", casi seguro
   Metro se lanzó desde `versiculo-diario`**, que sigue en SDK 54: los dos
   repos usan el mismo `pnpm.cmd mobile`. Ya pasó el 2026-11-24 (quedó en
   el puerto 8082). Para comprobarlo, la línea `Starting project at …`
   debe decir `reflexion-diaria\apps\mobile`. **Causa real:** las pestañas
   del Terminal de la app de Claude se abren en `versiculo-diario`, la
   carpeta de trabajo de la sesión que creó este proyecto. Lanzar con
   `Set-Location -LiteralPath '…\reflexion-diaria'; pnpm.cmd mobile
   --clear --port 8083` (puerto propio para no chocar con un Metro de
   Versículo que siga abierto) y escanear ESE QR.
5. **Node 22.13+**: pnpm 11 usa `node:sqlite`. Va fijado en `engines.node`
   y `.nvmrc`. En EAS hay que poner `"node": "22.13.0"` en cada perfil de
   `eas.json` (Fase 11). En Railway, `NIXPACKS_NODE_VERSION` no funciona.
6. **`EXPO_PUBLIC_API_URL` va en el bloque `env` de cada perfil de
   `eas.json`**: el `.env` local no se sube al build de EAS.
7. **"Hoy" = `America/Bogota` fijo** (`backend/app/core/dates.py`), no UTC.
8. **Backend → Postgres: `pool_pre_ping=True, pool_recycle=300`**, porque
   el proxy de Railway mata las conexiones idle (Fase 2).
9. **Nunca `firebase-admin` en Python**: tumbó producción por OOM. Se
   verifica el token con PyJWT y los certs públicos de Google (Fase 9).
10. **Cron de contenido**: debe salir con exit code 1 si un día queda sin
    contenido. En Versículo hubo 12 días de 404 con el cron en verde.
11. **Railway**: `railway up` desde la raíz del repo; correr
    `railway status` antes del primer `up` (sin link crea un proyecto
    duplicado); el Root Directory del admin es la raíz del monorepo.
12. **Patrones de UI ya aprendidos**: actualizaciones optimistas en las
    mutaciones; teclado (`KeyboardAvoidingView`, `tabBarHideOnKeyboard`,
    `keyboardShouldPersistTaps`); el loading se muestra donde va a
    aparecer la data; `DateTimePickerAndroid.open` imperativo.

## Infraestructura

- **Backend:** `https://reflexion-diaria-production.up.railway.app`, en un
  proyecto Railway propio (no es `diligent-reflection`, que es el de
  Versículo). Servicios: backend (repo de GitHub, deploy automático en
  cada push a `main`) + Postgres 18.
- **Config del servicio como código:** `backend/railway.json`, con
  migraciones en el pre-deploy (`alembic upgrade head`; si fallan, el
  deploy se cancela y queda la versión anterior), arranque con uvicorn y
  healthcheck en `/health`. En el dashboard solo quedan Root Directory =
  `/backend`, Railway Config File = `/backend/railway.json` (ruta
  absoluta: no se resuelve dentro del Root Directory) y la variable
  `DATABASE_URL = ${{Postgres.DATABASE_URL}}` (URL privada, red interna).
- **Migraciones:** se aplican solas al desplegar. No hay que correrlas a
  mano contra producción, salvo en desarrollo local.
- **Postgres con el proxy público ABIERTO** mientras desarrollamos (lo
  usa `backend/.env` en local). **Cerrarlo antes de lanzar**, como en
  Versículo (gotcha #7 de su `CLAUDE.md`).
- CORS: cuando se despliegue el admin (Fase 9), agregar su dominio en
  `backend/app/main.py`.

## Modelo de datos (backend/app/models.py)

- **`reflections`**: una fila = una pieza completa: `quote` (frase,
  única), `body` (reflexión), `action` (acción concreta para hoy),
  `status`, `source` (`human`/`ai`, quién escribió el borrador; no es una
  atribución pública), `reviewed_by`, `mood_tags`. Frase y reflexión van
  en **una sola tabla a propósito** (decisión de Erick): en Versículo eran
  dos porque el versículo es texto externo reutilizable; acá la frase es
  original y se revisa siempre junto con su reflexión.
- **`daily_reflections`**: `date` (única) → `reflection_id`. El
  `reflection_id` no es único, para que el cron pueda reutilizar
  reflexiones publicadas.
- `status` y `source` se validan con un **CHECK en Postgres**
  (`ck_reflections_status`/`ck_reflections_source`), no solo en Python.
  Si se agrega un estado, hay que cambiar `app/constants.py`, crear una
  migración que recree el CHECK y actualizar `packages/shared`.
- Los endpoints públicos (`routers/daily_reflection.py`) parten todos de
  la consulta base `_published`. Cualquier endpoint público nuevo debe
  partir de ahí.
- `MOOD_TAGS` es provisional (`app/constants.py` + `packages/shared`). Se
  afina en la Fase 10.

## Sistema de diseño (apps/mobile/src/theme)

- **Dirección "Claridad"** (elegida por Erick entre 3 propuestas): fresca
  y práctica, acento verde profundo (`#1F6B52` en claro, `#5CC49A` en
  oscuro) y **una sola familia tipográfica, Manrope**. Se separa a
  propósito del estilo serif y cálido de Versículo, para que las dos
  apps no parezcan la misma marca.
- **Colores:** tokens semánticos en `colors.ts` (`textPrimary/Secondary/
  Muted`, `accent`/`onAccent`, `actionBackground/Label/Text` para la caja
  "Para hoy", `surface`, `border`, `error`). **Nunca escribir hex en las
  pantallas.** Los 20 pares texto/fondo cumplen WCAG AA (mínimo 4.69:1).
  Si se cambia un color, volver a medir el contraste.
- **Tipografía:** `typography.ts` importa solo los pesos usados (400, 500
  y 700) por subpath (`@expo-google-fonts/manrope/400Regular`), no desde
  la raíz del paquete, que metería los 7 pesos (~100 KB cada uno) en el
  bundle. Escala: `quote`, `title`, `body`, `label`, `caption`, `button`.
- **`ThemeProvider`** sigue el modo del sistema. La preferencia explícita
  Claro/Oscuro de Ajustes (Fase 7) se resuelve ahí mismo. El splash se
  mantiene hasta que cargan las fuentes (si fallan, se sigue con la del
  sistema).
- **Componentes base:** `AppText` (todo texto pasa por aquí), `Screen`
  (SafeArea + KeyboardAvoidingView), `Button` (primary/secondary,
  mínimo 44 px de alto), `StateMessage` (`LoadingState`/`ErrorState`/
  `EmptyState`, que ocupan el espacio donde irá el contenido) y
  `ReflectionCard` (frase + reflexión + "Para hoy", reutilizable en el
  historial y en favoritos).
- **Pendiente para la Fase 11 (tamaño del bundle):** `expo-router` 57 mete
  una fuente MaterialSymbols de ~976 KB (vía `expo-symbols`, desde su
  código de native tabs para Android) aunque no se usen native tabs.

## Comandos

- Instalar: `pnpm install` (raíz).
- Mobile: `pnpm mobile` (Expo Go). Verificar el bundle: ver gotcha #3.
- Admin: `pnpm admin`; build con `pnpm --filter admin build`.
- Backend: `cd backend`, luego `py -3.13 -m venv .venv`,
  `.venv\Scripts\python -m pip install -r requirements.txt` y
  `.venv\Scripts\python -m uvicorn app.main:app --reload` → `GET /health`.
  `backend/.env` lleva `DATABASE_URL` = `DATABASE_PUBLIC_URL` del Postgres
  de Railway (proxy público). No hay Postgres local ni Docker en la
  máquina.
- Migraciones: `.venv\Scripts\alembic upgrade head`. Para comprobar que
  modelos y base coinciden: `.venv\Scripts\alembic check`.

## Roadmap (11 fases)

1. ✅ **Monorepo** (2026-11-23): esqueleto pnpm (mobile/admin/backend/
   shared) con los fixes de pnpm+Metro. Verificado: bundle Android con una
   sola copia de React, `vite build` y oxlint limpios, `/health` responde.
2. ✅ **Modelo de datos + `GET /daily-reflection`** (2026-11-23). Ver
   "Modelo de datos" abajo. Verificado contra el Postgres de Railway:
   published de hoy → 200; `reviewed` → 404 (tanto por fecha como por
   id); el CHECK rechaza estados inválidos; `quote` duplicada rechazada;
   `alembic check` sin diferencias.
3. ✅ **Backend desplegado en Railway** (2026-11-23). Ver
   "Infraestructura". Verificado: `/health` 200; producción lee la misma
   base (dato `published` temporal → 200, tras borrarlo → 404); la base
   quedó en la migración `37bf00893bb9`.
4. ✅ **App Expo consumiendo el backend real** (2026-11-24): incluye la
   subida a SDK 57. `src/api/client.ts` lanza un `ApiError` con el código
   HTTP. `useDailyReflection` devuelve `null` ante un 404, que es un
   **estado vacío** y no un error, así que no se reintenta (en Versículo
   un 404 se confundía con una caída de red). `app/index.tsx` tiene los
   estados cargando, error con reintento, vacío y contenido (frase +
   reflexión + caja "Para hoy"), y se puede deslizar para recargar.
   `apps/mobile/.env` apunta a producción. Verificado en Expo Go en el
   Xiaomi 10T de Erick, con un dato de prueba que ya se borró.
   Pendiente para la fase de engagement: refrescar la reflexión al volver
   la app al primer plano o al cambiar el día (hoy no se refresca sola si
   la app queda abierta pasada la medianoche).
6. ✅ **Fase 6, identidad anónima + favoritos + historial + diario**
   (2026-11-24, por subpasos con aprobación entre cada uno):
   - ✅ **6a, backend** (2026-11-24): `users` (anónimos), `favorites` y
     `journal_entries` (nota + `action_done`, que solo se cambia hoy o
     ayer), `GET /history?month=`, `GET /journal/stats` (conteo sin
     rachas). Usuario con upsert `ON CONFLICT`. `queries.visible_daily()`
     exige publicado y fecha ≤ hoy; antes se podían leer por id los días
     futuros que el cron publica por adelantado (**Versículo tiene ese
     mismo hueco**). 32/32 pruebas e2e.
   - ✅ **6b, mobile: identidad, pestañas y favoritos** (2026-11-24,
     probado en el Xiaomi). `src/lib/deviceId.ts` cachea la *promesa*:
     sin carrera de dos UUID en el primer arranque. Pestañas Hoy /
     Favoritos / Historial / Diario (`app/(tabs)`). El alto de la barra
     suma `insets.bottom` a mano: con edge-to-edge de SDK 57 quedaba
     pegada a los botones de Android. Corazón optimista
     (`useToggleFavorite`) y detalle `app/day/[id].tsx`, que usa el cache
     como `placeholderData` y no reintenta ante un 404.
     Fechas: `parseISODate` evita el corrimiento UTC de
     `new Date("YYYY-MM-DD")`.
   - ✅ **6c, historial** (2026-11-24, probado en el Xiaomi).
     `HistoryCalendar` con semana de lunes a domingo; los días con
     contenido usan el tono suave de `actionBackground`; hoy lleva un
     anillo y los favoritos un punto (el espacio del punto siempre se
     reserva para que las filas no salten). No navega más allá del mes
     actual. Lista del mes debajo, de lo más reciente a lo más viejo.
     `useHistory(month)` hace una request por mes con
     `keepPreviousData`; mientras `isPlaceholderData` es verdadero, la
     pantalla **no** muestra los datos del mes anterior como si fueran
     del nuevo (muestra el loading en la zona de la lista).
   - ✅ **6d, diario + "¿hiciste la acción?"** (2026-11-24, probado en el
     Xiaomi). `DayJournal` va debajo de la `ReflectionCard` en Hoy y en
     el detalle: botón "Lo hice" (solo hoy o ayer, `canMarkAction`; en
     días más viejos es solo lectura) + nota opcional (máx. 2000
     caracteres, `maxHeight`, `keyboardShouldPersistTaps="handled"`; el
     modo edición se cierra **al tocar Guardar**, sin esperar al
     servidor). `useUpdateJournal` es optimista sobre la entrada y la
     lista; todas las claves cuelgan de `["journal"]`. Pestaña Diario:
     resumen del mes sin rachas (con 0 invita, no reprocha) + lista. En
     el calendario, acción hecha = círculo sólido de acento, hoy = anillo
     `textPrimary`, favorito = punto, y hay leyenda.
   - Datos de prueba borrados de producción al cerrar la fase (quedó solo
     el usuario anónimo del teléfono de Erick).
5. ✅ **Sistema de diseño "Claridad" + modo oscuro** (2026-11-24). Ver
   "Sistema de diseño" arriba. Revisado por Erick en Expo Go, en claro y
   en oscuro. A pedido suyo, la reflexión se centra verticalmente en el
   espacio libre de Inicio, para que una frase corta no deje un hueco
   abajo.
6. Identidad anónima + favoritos + historial + diario personal (con
   "¿hiciste la acción de hoy?").
7. Recordatorios mañana/noche + Ajustes.
8. Compartir como imagen.
9. Panel admin completo + Firebase nuevo + deploy en Railway.
10. Guía editorial + lotes de contenido (IA → `ai_generated` → revisión
    de Erick → `reviewed`) + cron `auto-schedule`.
11. Identidad visual (ícono, splash) + EAS (preview APK, production AAB
    con R8) + ficha en Google Play.

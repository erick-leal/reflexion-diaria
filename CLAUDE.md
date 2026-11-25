# Reflexión Diaria (nombre visible: "Un paso a la vez")

## ▶ Cómo retomar / próximo paso (actualizar al cerrar cada fase)

**Estado al 2026-11-25:** fases 1–11 cerradas. La app está en Google Play
en **prueba interna** y la **prueba cerrada** (ficha + contenido + versión
2/1.0.0) se **envió a revisión de Google el 2026-11-25**. Producción del
backend sirve contenido real; quedan ~42 `reviewed`. Cuando el admin avise
de menos de 7 revisadas, hacer un lote nuevo (ver "Contenido y cron";
ojo: ahora hay que abrir el proxy del Postgres, ver "Infraestructura").

**Próximo paso: publicar en producción.** Cuando Google apruebe la prueba
cerrada: mandar el link de la prueba cerrada (Play Console → Prueba
cerrada → Testers) a la lista "Testers Versiculo Diario", esperar **≥12
testers aceptados durante ≥14 días seguidos** y pedir acceso a producción
(Panel de control). Antes del build de producción definitivo, hacer el
pendiente de permisos de abajo.

**Pendientes sueltos (no olvidar):**
- **Permisos sobrantes en el AAB:** `SYSTEM_ALERT_WINDOW` y
  `READ/WRITE_EXTERNAL_STORAGE` los mete Expo por defecto y la app no los
  usa. Quitarlos con `android.blockedPermissions` en `app.json`, nuevo
  build y probar compartir (usa el almacenamiento de caché, no externo).
- **Confirmar que el pre-deploy aplica migraciones** con la primera
  migración nueva (mirar el log del deploy en Railway).
- Las capturas de la ficha salieron de imágenes de 900×2000 (comprimidas
  por el chat) escaladas a 1080×1920; si se ven blandas, rehacerlas con
  los PNG originales del teléfono.

**Para trabajar eficiente (consumo de tokens):**
- **Una sesión por fase**, abierta en **esta carpeta**
  (`…\repository\reflexion-diaria`), no en `versiculo-diario`: si no, se
  cargan los dos `CLAUDE.md` y las terminales lanzan el proyecto equivocado.
- Si una fase se alarga, usar `/compact`. Al cerrar cada fase, actualizar
  esta sección y hacer commit.
- **Railway:** usar el conector MCP de Railway, no clics en el dashboard
  con el navegador (las capturas de pantalla gastan mucho contexto y hubo
  dos errores de clic). Para cosas de 1–2 clics en un dashboard, darle
  instrucciones a Erick suele ser más barato.
- Metro para probar en el teléfono: `pnpm.cmd mobile --clear` desde esta
  carpeta (ver gotcha #4).

---

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

## Gotchas propios (Fase 11)

13. **Peer deps nativas que pnpm instala solas** (rompió el primer build
    de EAS): `expo-router` pide `react-native-reanimated` y
    `react-native-worklets` como peer; sin tenerlas en `package.json`,
    pnpm instalaba las últimas (4.8.0 / 0.14), incompatibles con RN 0.86,
    y Gradle fallaba en `assertMinimalReactNativeVersionTask`. **Expo Go
    no lo muestra** (trae sus módulos nativos) y `expo-doctor` /
    `expo install --check` solo revisan dependencias directas. Fix: están
    fijadas como directas (4.5.1 / 0.10.1). Tras subir el SDK, revisar
    **todas** las nativas instaladas contra
    `node_modules/expo/bundledNativeModules.json`, no solo las directas.
14. **Peso del bundle:** importar íconos siempre por subruta
    (`import Ionicons from "@expo/vector-icons/Ionicons"`); el índice de
    `@expo/vector-icons` mete ~19 fuentes (~4 MB). La fuente MaterialSymbols
    de `expo-router` (vía native tabs → `expo-symbols`) está anulada en
    `metro.config.js` (`emptyModules`); si algún día se usan native tabs o
    `SymbolView` en Android, quitar esa regla. Assets: 5.3 MB → 740 KB.
15. **Play Protect** bloquea el APK de preview: "⋮ → Instalar de todos
    modos" (igual que en Versículo). El link de prueba interna en el
    Xiaomi abría un modal de Play en blanco / "Reintentar": aceptar la
    invitación desde el PC y luego instalar.
16. **Prueba cerrada de 12 testers × 14 días es por app**, no por cuenta:
    tener a Versículo publicado no la salta. Se reutiliza la lista de
    correos "Testers Versiculo Diario".

## Infraestructura

- **Proyecto Railway** `steadfast-sparkle`
  (id `e9629d7c-000f-42ca-8ad7-c16d14091f94`; no es `diligent-reflection`,
  que es el de Versículo). Tres servicios, todos con deploy automático en
  cada push a `main`:
  - **`reflexion-diaria`** (backend):
    `https://reflexion-diaria-production.up.railway.app`.
  - **`admin`** (panel): `https://admin-production-23567d79.up.railway.app`.
  - **`Postgres`** 18.
  - **`auto-schedule`** (cron de contenido, sin dominio): Root Directory
    `/backend`, start `python -m scripts.auto_schedule`, cron
    `0 9 * * *` (04:00 Bogotá), restart policy Never, watch paths
    `/backend/**`, variable `DATABASE_URL = ${{Postgres.DATABASE_URL}}`.
- **⚠️ Config as Code (`railway.json`) está obsoleto en Railway:** los
  servicios nuevos no pueden activarlo y los existentes dejan de leerlo el
  **2026-12-01**. Por eso **toda la configuración vive en el dashboard de
  cada servicio** (Settings), no en archivos del repo:
  - **backend:** Root Directory `/backend`, **pre-deploy `alembic
    upgrade head`** (si falla, el deploy se cancela y queda la versión
    anterior), start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`,
    healthcheck `/health`. Variables: `DATABASE_URL =
    ${{Postgres.DATABASE_URL}}` (URL privada), `FIREBASE_PROJECT_ID`,
    `ADMIN_EMAIL`.
  - **admin:** Root Directory = raíz del monorepo (depende de
    `packages/shared`). Build `pnpm install --frozen-lockfile && pnpm
    --filter admin build`, start `pnpm --filter admin exec serve -s dist
    -l $PORT` (`-s` = fallback SPA, para que `/reflexiones` funcione al
    recargar), healthcheck `/`, watch paths `/apps/admin/**`,
    `/packages/shared/**` y `/pnpm-lock.yaml` (no se redespliega con
    cambios de backend o mobile). Puerto 8080. Sin variables: la config
    de Firebase y la URL del backend van en el código, porque son públicas.
  - `backend/railway.json` se borró en la Fase 11.
- **Migraciones:** se aplican solas en el pre-deploy. El pre-deploy se
  configuró el 2026-11-24, y la primera migración nueva que se despliegue
  confirma que corre (revisar el log del deploy).
- **Postgres SIN proxy público** (cerrado el 2026-11-25). Backend y cron
  usan la URL privada y no se enteran. **`backend/.env` local ya no
  conecta.** Para correr algo local contra la base (cargar un lote,
  `alembic check`): con el conector MCP de Railway, `create-tcp-proxy` en
  el servicio `Postgres` (puerto 5432), poner el host:puerto nuevo en
  `DATABASE_URL` de `backend/.env` (cambia cada vez), hacer lo necesario y
  **borrarlo** con `delete-tcp-proxy`. Síntoma de proxy cerrado: psycopg
  "server closed the connection unexpectedly".
- **Si cambia el dominio del admin:** actualizar `allow_origins` en
  `backend/app/main.py` **y** los dominios autorizados de Firebase Auth.
- **Gotchas al operar Railway desde el navegador** (pasó el 2026-11-24):
  escribir con el foco fuera de un campo dispara atajos que crean
  servicios borrador (`function-bun`), y la lista de repos se reordena al
  cargar, lo que provocó un clic sobre el repo equivocado. Ambos quedaron
  como cambios *staged* y se descartaron en "Details". **Antes de
  "Deploy" revisar siempre "Details"**, filtrar la lista de repos por
  nombre y llenar los campos directamente. Ahora hay un **conector MCP de
  Railway** disponible, preferible a operar el dashboard a mano.

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
- `MOOD_TAGS` (12, definidas en la guía editorial) vive en
  `app/constants.py` + `packages/shared`, con `MOOD_TAG_LABELS` (con
  tildes) en shared. El admin valida contra la lista del backend, así que
  al agregar una etiqueta hay que desplegar el backend antes de usarla.

## Contenido y cron (Fase 10)

- **Guía editorial:** `docs/guia-editorial.md` (voz, largos, test de la
  acción, lista negra, checklist de revisión). Todo lote nuevo la sigue.
- **Lotes:** `scripts/content/lote_XX.py` (lista `REFLECTIONS`). Se cargan
  desde la raíz con
  `backend/.venv/Scripts/python scripts/seed_content.py lote_XX --check`
  (valida contra la guía y dice cuántas entrarían) y luego sin `--check`.
  Entran en `ai_generated`/`source="ai"`. Es idempotente: salta las frases
  que ya existen, sin pisar lo que Erick editó. En Git Bash, usar
  `PYTHONIOENCODING=utf-8`.
- **Cron `auto-schedule`** (`backend/scripts/auto_schedule.py`): llena
  hoy y los 2 días siguientes. Toma una `reviewed` al azar y la pasa a
  `published`; si no quedan, reutiliza una `published` fuera de un
  cooldown de 90 días (medido contra la fecha que llena), y si no hay,
  repite antes que dejar el día vacío. Nunca toma `draft`/`ai_generated`.
  **Exit 1 si una fecha queda vacía.** Avisa en stderr si quedan menos de
  7 revisadas. `--dry-run` no escribe. Si `/daily-reflection` da 404,
  mirar primero los logs de este servicio.

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
7. ✅ **Recordatorios + Ajustes** (2026-11-24, probado en el Xiaomi:
   tema, invitación y notificaciones reales de mañana y noche).
   **Solo mobile, sin backend.** Decisiones de Erick:
   - **Ajustes en el teléfono** (`src/lib/settings.tsx`, AsyncStorage
     `settings-v1`, merge con defaults), no en el servidor como en
     Versículo: el servidor nunca los usa, y así el tema se aplica antes
     del primer frame (el layout no quita el splash hasta leerlos).
     Apariencia Automático/Claro/Oscuro.
   - **Noche "inteligente"**: no suena si ya se marcó "Lo hice" hoy. La
     mañana es un trigger `DAILY`; la noche son triggers `DATE` sueltos
     para los próximos 14 días (un trigger repetido no puede saltarse un
     día). `ReminderSync` (sin UI, montado en `app/(tabs)/_layout.tsx`)
     reprograma todo al abrir o volver a primer plano, al cambiar los
     ajustes y al marcar o desmarcar la acción. `rescheduleReminders` se
     encola para que dos reprogramaciones no se intercalen y dupliquen
     notificaciones. Canal Android `recordatorios`.
   - **Invitación al marcar "Lo hice" por primera vez** (no al abrir la
     app): tarjeta inline en `DayJournal`, una sola vez
     (`reminderInviteSeen`). La lógica de pedir permiso y activar vive
     en `useActivateReminders`, compartida con Ajustes.
   - Hora con `DateTimePickerAndroid.open` (API imperativa, el fix de
     Versículo). Solo Android: en iOS la fila de la hora está desactivada
     hasta que iOS entre en alcance.
   - Expo Go no trae push remotas en Android desde SDK 53, pero las
     notificaciones **locales** sí funcionan (verificado).
8. ✅ **Compartir como imagen** (2026-11-24, probado en el Xiaomi).
   Decisiones de Erick: formato **historia 9:16** con **frase + acción**
   y un interruptor para sumar la nota del diario. `ShareButton` (junto al
   corazón, en Hoy y en el detalle) abre `ShareSheet`; la tarjeta es
   `ShareCard`, `react-native-view-shot` la captura y `expo-sharing` abre
   el menú de compartir.
   - **Fondos planos fijos** Verde (por defecto) / Claro / Noche en
     `SHARE_BACKGROUNDS`, no imágenes JPG como en Versículo, y no
     dependen del tema de la app. Los 12 pares texto/fondo cumplen AA (la
     caja del verde se oscureció a `#16533F`: con `#2C7E63` quedaba en
     3.87:1).
   - **Gotcha de nitidez:** las opciones `width`/`height` de `captureRef`
     solo **estiran** el bitmap de la vista. Por eso se captura una
     **copia fuera de la pantalla** (`left: -10000`) dibujada a
     `1080 / PixelRatio.get()` dp, es decir, 1080 px reales, sin bordes
     redondeados (en el PNG quedarían esquinas transparentes). `ShareCard`
     escala todas sus medidas con la prop `width`.
   - La vista previa se adapta al alto de la pantalla (`previewWidth`)
     para que tarjeta, fondos y botón entren sin scroll (pedido de Erick).
     Si se agrega algo a la hoja, actualizar las constantes de alto de
     `ShareSheet.tsx`.
9. ✅ **Panel admin + Firebase + deploy** (2026-11-24; Erick entró en
   producción con su cuenta).
   - **Firebase** `un-paso-a-la-vez-3cc3f`: solo Email/Password, un
     usuario (el de `ADMIN_EMAIL`), **registro público desactivado**,
     dominio del admin autorizado.
   - **Backend** (`app/admin_auth.py`): ID token verificado con
     `PyJWKClient` (JWKS de Google) + correo == `ADMIN_EMAIL`, sin
     distinguir mayúsculas. **Nunca `firebase-admin`.** Si faltan las
     variables, `/admin` responde 503 y el resto de la API sigue viva.
   - **Endpoints `/admin`** (`routers/admin.py`, `require_admin` aplicado
     a nivel de router): reflexiones (listar con `status`/`q`, crear,
     editar, `bulk-review`, borrar), `stats` (incluye `scheduled_ahead`) y
     calendario (programar/quitar). **Reglas editoriales en el
     servidor:** no se programa nada que no esté `reviewed` o
     `published`; al programar queda `published`; no se crea ni edita a
     mano a `published`; no se programan fechas pasadas; no se quitan hoy
     ni fechas pasadas (ya las vieron usuarios); no se borra una
     reflexión programada. 26/26 pruebas.
   - **UI** (`apps/admin`): login, Resumen (con avisos si hay menos de 3
     días programados o menos de 7 revisadas, para evitar el incidente
     de 12 días sin contenido de Versículo), Reflexiones (filtros,
     búsqueda, crear/editar en `<dialog>`, marcar revisadas en lote) y
     Calendario. La config de Firebase va en el código. React del admin
     fijado **exacto** en `19.2.3` (igual que mobile).
10. ✅ **Guía editorial + lote 1 + cron `auto-schedule`** (2026-11-24).
    Ver "Contenido y cron". Verificado de punta a punta: Erick revisó las
    45 en el admin; el "Run now" del cron en Railway programó del 24 al 26
    de noviembre (exit 0); `/daily-reflection` responde 200 en producción,
    los días futuros dan 404 por id, y la app muestra la reflexión real en
    Expo Go. El primer intento de revisión no llegó al backend (no hubo
    llamadas en los logs) y se resolvió recargando el admin: si una acción
    del admin "no queda", mirar primero los logs del backend.
11. ✅ **Identidad visual + EAS + Google Play** (2026-11-24/25, APK
    probado en el Xiaomi; prueba cerrada enviada a revisión):
    - **Ícono "cuatro escalones"** (elegido por Erick entre varias
      variantes): escalera blanca sólida sobre `#1F6B52`. Todo lo genera
      `scripts/generate_app_icon.py` (Pillow, solo en el venv local):
      ícono, adaptive icon con monocromo, splash claro/oscuro
      (`splash-icon-dark.png` en `#5CC49A`), favicon, ícono 512 y gráfico
      de funciones de Play. Para cambiarlo, editar el script y correrlo.
    - **Bundle:** ver gotcha #14.
    - **EAS:** proyecto `@ericklealescobar/reflexion-diaria` (cuenta
      personal, no la de equipo), `apps/mobile/eas.json` con preview (APK)
      y production (AAB, `autoIncrement`, `appVersionSource: local`, así
      que el `versionCode` sube en `app.json` y hay que commitearlo). R8
      con `expo-build-properties` (minify + shrink). Keystore en EAS.
      Builds: `eas.cmd build --profile <perfil> --platform android
      --non-interactive --no-wait` desde `apps/mobile`.
    - **Privacidad:** `GET /privacy` (HTML) y `DELETE /me` (borra el
      usuario anónimo; favoritos y diario por CASCADE; no usa
      `get_current_user_id` porque esa dependencia lo crearía). En la app,
      Ajustes → "Tus datos": link a la política y "Borrar mis datos"
      (cancela requests en vuelo, borra, genera UUID nuevo).
    - **Play Console** (app "Un paso a la vez"): todo lo declarado está en
      `docs/play-store/ficha.md` (textos, data safety, IARC "todas las
      edades", público 18+, sin funciones de salud, categoría Estilo de
      vida). Prueba interna activa; prueba cerrada Alpha enviada a
      revisión. Producción: ver "Próximo paso" arriba.
    - Proxy del Postgres cerrado y `backend/railway.json` borrado.

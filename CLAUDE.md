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
- **Nombre:** "Reflexión Diaria". **Package Android / bundle iOS:
  `com.erickleal.reflexiondiaria`**, que es permanente una vez publicado
  en Play.
- **Infraestructura propia**: proyecto Railway nuevo y proyecto Firebase
  nuevo, sin compartir nada con Versículo Diario. Así un deploy o una
  migración de una app nunca afecta a la otra.

## Stack

- **Mobile** (`apps/mobile`): React Native + Expo **SDK 54** + TypeScript,
  Expo Router, TanStack Query (desde la Fase 4), StyleSheet.
- **Admin** (`apps/admin`): React + Vite + TypeScript; Firebase Auth en la
  Fase 9.
- **Backend** (`backend/`): FastAPI; SQLAlchemy 2.0 + Alembic + PostgreSQL
  desde la Fase 2.
- **Compartido** (`packages/shared`, `@reflexion-diaria/shared`): tipos TS
  para mobile y admin.

## Gotchas heredados de Versículo Diario (ya aplicados, no revertir)

1. **`.npmrc` con `shamefully-hoist=true`**: Expo/RN asumen el hoisting
   clásico de npm.
2. **Metro con hierarchical lookup ACTIVO**: no poner
   `disableHierarchicalLookup = true`; con pnpm se rompe.
3. **Una sola copia de React en el bundle**: `metro.config.js` fuerza
   `react`/`react-native` hacia `apps/mobile/node_modules`, porque el
   admin usa React 19.2.x y mobile 19.1.0. Para verificarlo, en
   `apps/mobile` correr `npx expo export --platform android --source-maps`;
   en el `.map` debe aparecer UNA sola ruta `node_modules/react/index.js`
   (`react@19.1.0`).
4. **SDK 54 fijo**: Expo Go va detrás del último SDK.
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

## Comandos

- Instalar: `pnpm install` (raíz).
- Mobile: `pnpm mobile` (Expo Go). Verificar el bundle: ver gotcha #3.
- Admin: `pnpm admin`; build con `pnpm --filter admin build`.
- Backend: `cd backend`, luego `py -3.13 -m venv .venv`,
  `.venv\Scripts\python -m pip install -r requirements.txt` y
  `.venv\Scripts\python -m uvicorn app.main:app --reload` → `GET /health`.

## Roadmap (11 fases)

1. ✅ **Monorepo** (2026-11-23): esqueleto pnpm (mobile/admin/backend/
   shared) con los fixes de pnpm+Metro. Verificado: bundle Android con una
   sola copia de React, `vite build` y oxlint limpios, `/health` responde.
2. Modelo de datos + `GET /daily-quote`: `Quote`, `Reflection` (con
   `action`, estados editoriales y `mood_tags`), `DailyQuote`; Alembic.
3. Proyecto Railway nuevo: backend + Postgres sin acceso público.
4. App Expo consumiendo el backend real (TanStack Query).
5. Sistema de diseño propio + modo oscuro.
6. Identidad anónima + favoritos + historial + diario personal (con
   "¿hiciste la acción de hoy?").
7. Recordatorios mañana/noche + Ajustes.
8. Compartir como imagen.
9. Panel admin completo + Firebase nuevo + deploy en Railway.
10. Guía editorial + lotes de contenido (IA → `ai_generated` → revisión
    de Erick → `reviewed`) + cron `auto-schedule`.
11. Identidad visual (ícono, splash) + EAS (preview APK, production AAB
    con R8) + ficha en Google Play.

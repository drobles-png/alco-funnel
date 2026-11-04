# ALCO — Funnel VSL "Tu propio dron de fumigación" (alco-funnel)

Segunda landing de **ALCO** (drones DJI Agras desde 2015, Ecuador). La primera (`../alco-landing1`,
`alco-landing.vercel.app`) vende el negocio de fumigar para terceros; **esta** le habla al
**agricultor con finca (30–100 ha)** que hoy depende de un servicio externo para fumigar y lo invita a
comprar su propio dron. Vocero del VSL: **Fernando Alvear**. CTA: agendar reunión (cultivo, hectáreas,
cómo fumiga hoy).

Estrategia (ficha_tecnica, MCP bakano): venta de ticket alto (~$23.000), objetivo **citas agendadas**.

Hecho desde `drobles-png/funnel-vsl-base` (skill `funnel-vsl-bakano`). Comandos, convenciones y
envíos generales: ver el README de la base y la skill.

## Comandos
`pnpm install` · `pnpm dev` · `pnpm type-check` · `pnpm build`
E2E: `python <skill>/scripts/e2e_funnel.py --base http://localhost:5173 --steps e2e/agenda.json --mode stub`

## Config — `src/config/funnel.ts`
| Constante | Valor |
|---|---|
| `META_PIXEL_ID` | `1791691808756260` (mismo pixel que alco-landing1) |
| `GHL_CONTACT_WEBHOOK` | `…/XoOotYo4Ler5SKSjWqAV` (registro, cita_agendada) |
| `GHL_QUALIFICATION_WEBHOOK` | `…/lXQkJvJH1icRLPrNGYra` (cualificación) |
| `GHL_BOOKING_CALENDAR` / `_FRAME_ID` | `widget/booking/p7YsTfZnCmrsX9EMsBRv` / `p7YsTfZnCmrsX9EMsBRv_1793804976879` |
| `WISTIA_MEDIA_ID` | **PENDIENTE** (sin video, /ver-video muestra "se publica en breve") |
| `ASK_CITY` | `true` |
| `SITE_URL` | `https://alco-funnel.vercel.app` (también en index.html og:url/og:image) |
| `FUNNEL_TAG` | `funnel-alco-finca` → separa estos leads de los de alco-landing1 en GHL |
| `STORAGE_PREFIX` | `alcf` |
| `LEGAL` | razón social, RUC y correo **PENDIENTES** (se ven como "[Pendiente]") |

`META_CAPI_TOKEN` solo en `.env.local` y env vars de Vercel.

## Cualificación — `src/utils/qualification.ts`
Preguntas (del VSL): finca, cultivo, hectáreas, cómo fumiga hoy, provincia, inversión + abierta
"¿Qué te pasa hoy cuando tienes que fumigar?" (`objetivo`).
**Descalifica** solo `finca = sin_finca` o `inversion = sin_presupuesto`. Hectáreas (incl. < 30),
cultivo, cómo fumiga y provincia son info para el asesor. Los `value` ya no se renombran una vez
mapeados en GHL (solo agregar).

## Marca
Azul ALCO `#004784`, azul noche `#0B1F33`, verde cultivo `#2E9B4F`, fondo `#F2F5F8`
(`src/styles/tokens.scss`). Oswald (títulos en mayúsculas, eyebrows) + Open Sans (texto).
Logos en `src/assets/logos/` (copiados de alco-landing1).

## No hacer
- No inventar cifras, testimonios, casos ni escasez. Copy solo con lo que dice el VSL.
- No poner `META_CAPI_TEST_EVENT_CODE` en producción.

## Pendientes
- ID de Wistia del VSL.
- Datos legales de ALCO.
- Mapear en GHL los campos de cualificación (`*_label`) y verificar los triggers con contactos de prueba.

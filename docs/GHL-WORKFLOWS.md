# GHL — Workflows del funnel ALCO "Tu propio dron"

Esta guía explica qué hay que armar en la subcuenta de ALCO (`8udpWTKK6MRtnowbKO10`) para recibir
lo que manda https://alco-funnel.vercel.app. Este funnel es de **agenda, sin pago**, así que las
etapas `pago-iniciado` y `pagado` nunca llegan.

| Webhook (en `src/config/funnel.ts`) | Workflow | Etapas que recibe |
|---|---|---|
| `…/webhook-trigger/XoOotYo4Ler5SKSjWqAV` | OBTENER CONTACTO \| funnel alco finca | `registro`, `registro_parcial`, `cita_agendada` |
| `…/webhook-trigger/lXQkJvJH1icRLPrNGYra` | obtener cualificacion \| funnel alco finca | `cualificacion` |

> **Leads de las dos landings.** El pixel es el mismo que el de alco-landing1, y quizá también la
> subcuenta. Lo que separa los leads de este funnel es la etiqueta `funnel-alco-finca`. Si ALCO ya
> tiene workflows con el trigger "Etiqueta añadida" u otro trigger genérico, revisa que no se
> disparen también con estos contactos.

> **Meta: modo landing.** La landing manda los eventos del servidor por `/api/capi`
> (`META_CAPI_TOKEN` está en Vercel). Por eso **ningún workflow de esta guía lleva la acción
> "Meta Conversion API"** para CompleteRegistration, Lead o Schedule. En GHL esa acción no tiene
> Event ID y Meta contaría cada evento dos veces. Si ALCO ya tiene esa acción en sus workflows
> (por ejemplo, de alco-landing1), quítala de cualquier rama a la que lleguen leads de este funnel.
> La única excepción es la venta cerrada (sección 4).

---

## 0. Preparar la subcuenta (una sola vez)

1. **Contactos sin duplicados.** Ve a Configuración → Configuración del negocio → Preferencias de
   desduplicación de contactos. Apaga "Permitir la duplicación de contactos" y que busque primero
   por **Email** y luego por **Teléfono**. Sin esto, el registro, la cualificación y la cita crean
   3 contactos distintos.
2. **Campos personalizados.** Se crean en el objeto Contacto, dentro de la carpeta
   **"Funnel ALCO finca"**. Solo van los datos que GHL tiene que **usar** (para filtrar, armar
   listas o reportes, o pasarlos a otra acción). Lo que solo sirve para leer ya viene en la
   **nota** de cada envío: origen (fbclid y UTMs), hora y event_id.

   | Campo personalizado | Tipo | Se llena con `{{inboundWebhookRequest.…}}` | Workflow |
   |---|---|---|---|
   | UTM Source · UTM Campaign · UTM Content | Una línea c/u | `utm_source` · `utm_campaign` · `utm_content` | contacto |
   | Finca | Una línea | `finca_label` | cualificación |
   | Cultivo | Una línea | `cultivo_label` | cualificación |
   | Hectáreas | Una línea | `hectareas_label` | cualificación |
   | Cómo fumiga hoy | Una línea | `fumigacion_label` | cualificación |
   | Provincia | Una línea | `provincia_label` | cualificación |
   | Inversión | Una línea | `inversion_label` | cualificación |
   | Qué le pasa al fumigar | Varias líneas | `objetivo` | cualificación |
   | Califica | Una línea | `resultado` (`CALIFICA` / `NO_CALIFICA`) | cualificación |

   **FB clid** no hace falta crearlo: GHL ya lo trae como campo estándar. Lo usa el workflow de
   venta cerrada (sección 4).

   **Para qué sirven:**
   - **UTM:** filtrar contactos y oportunidades por campaña o anuncio, y ver cuál trae citas y
     ventas, no solo leads. Dentro de la nota también están, pero por texto no se puede filtrar.
     UTM Medium y Term son opcionales, porque casi siempre traen el mismo valor.
   - **Cualificación:** el asesor ve las respuestas en la ficha sin abrir la nota. También sirven
     para armar listas, por ejemplo "banano + Los Ríos + más de 50 ha".

   **No se crean:**
   - **fbc y fbp:** la landing los manda directo a Meta, y la acción de Meta de GHL usa el fbclid.
   - **Etapa:** el If/Else la lee directo del webhook.
   - **Event ID:** en este funnel los eventos a Meta los manda la landing.
   - **URL de registro:** ya está en la nota.

   Los campos de cualificación se mapean **solo** en ese workflow. Si se mapean en el de contacto,
   cada registro o cita los sobrescribe con vacío.

3. **Pipeline: se adapta el que ya viene en la subcuenta, "Citas Agendadas (Cierre De Ventas)"**.
   Este pipeline se copia junto con las automatizaciones de Bakano. No se crea otro. Sus etapas
   empiezan en la cita, así que se agregan las del funnel **antes** y una al **final**
   (en negrita las nuevas):

   **Registro incompleto** · **Registrado** · **Calificado (sin cita)** · Agendo Llamada ·
   Esperando Llamada (confirmado) · Reagendamiento · No Asistió · Asistió · 2da Llamada Agendada ·
   En Espera de Pago · Pago de Reserva · Cerrado - Contrato · Seguimiento General ·
   Seguimiento Caliente · No Interesado y/o Perdidos · **No califica**

   - "No califica" va al final, aparte de "No Interesado y/o Perdidos". Así, los descartados por la
     cualificación no se mezclan con las ventas perdidas en los reportes.
   - Si alco-landing1 usa este mismo pipeline, las etapas nuevas no la afectan: sus workflows
     siguen moviendo a las etapas de siempre.
   - En **todas** las acciones de oportunidad de esta guía: pipeline "Citas Agendadas (Cierre De
     Ventas)", **"Crear o actualizar"** y **"Permitir pasar a una etapa anterior" apagado**. Así, si
     llega tarde un `registro` después de una `cita_agendada`, la tarjeta no retrocede.
   - Revisa si el pipeline llegó con workflows propios, por ejemplo uno que se dispare al entrar a
     "Agendo Llamada" y mande algo a Meta o un mensaje. Si existe, podría duplicar lo que hace la
     landing o el calendario.

4. **Calendario.** Ya está conectado (`p7YsTfZnCmrsX9EMsBRv`). Revisa que tenga asignado al asesor
   y que la disponibilidad coincida con los cupos de la semana (`CUPOS_SEMANA = 3`, por confirmar).

5. **WhatsApp.** Antes de activar los mensajes, ten aprobadas las plantillas que se envíen fuera de
   la ventana de 24 h.

---

## 1. Workflow "OBTENER CONTACTO | funnel alco finca"

**Trigger:** Webhook entrante, con la URL `…/XoOotYo4Ler5SKSjWqAV`. Antes de mapear hace falta una
muestra (ver "Probar").

Esta parte corre para todas las etapas:

1. **Crear/actualizar contacto**
   - First name ← `Nombre` · Last name ← `Apellido` · Email ← `Email` · Phone ← `Telefono`
     (ya viene en formato E.164, ej. `+593991112233`)
   - FB clid ← `Fbclid` (campo estándar)
   - Country ← `Pais`. Llega el nombre ("Ecuador"). Si en la prueba el contacto queda sin país,
     quita este mapeo: el teléfono ya trae el +593.
   - Contact source: texto fijo `Funnel VSL ALCO finca`
   - UTM Source ← `Utm_source` · UTM Campaign ← `Utm_campaign` · UTM Content ← `Utm_content`
     (campos personalizados)
   - **No** mapear City: este funnel no pregunta ciudad (`ASK_CITY = false`).
2. **Esperar** 5 segundos.
3. **Añadir etiqueta** `funnel-alco-finca`.
4. **Añadir nota** ← `{{inboundWebhookRequest.nota}}`. Ya viene legible: nombre, contacto, origen
   del anuncio y event_id.
5. **Si/De lo contrario** según `{{inboundWebhookRequest.etapa}}` (el texto es igual a…):

| Rama | Etiqueta | Oportunidad (crear o actualizar) | Mensajes sugeridos |
|---|---|---|---|
| `registro` | `funnel-alco-finca-registro` | Registrado | Opcional: WhatsApp de bienvenida con el link a https://alco-funnel.vercel.app/ver-video |
| `registro_parcial` | `funnel-alco-finca-parcial` | Registro incompleto | Esperar 30 min → **Si** NO tiene `funnel-alco-finca-registro` → WhatsApp "te quedaste a un paso" con el link a la landing |
| `cita_agendada` | `funnel-alco-finca-cita` | Agendo Llamada | Notificación interna al asesor (la confirmación al cliente la manda el calendario) |
| **None** → renómbrala "Etapa desconocida" | `funnel-alco-finca-revisar` | — | Notificación interna con la nota: llegó una etapa que el flujo no conoce |

**Por qué la condición:** si no la pones, un abandono (`registro_parcial`) queda como "Registrado"
y una cita agendada deja la oportunidad en la etapa fija del flujo.

`registro_parcial` se manda cuando la persona escribe un email o teléfono válido y cierra el
formulario sin enviarlo. **No** es una conversión.

---

## 2. Workflow "obtener cualificacion | funnel alco finca"

**Trigger:** Webhook entrante, con la URL `…/lXQkJvJH1icRLPrNGYra`.

1. **Crear/actualizar contacto** con el mismo mapeo básico (nombre, apellido, email, teléfono, país)
   y además los campos de cualificación: Finca, Cultivo, Hectáreas, Cómo fumiga hoy, Provincia,
   Inversión ← cada `*_label`; Qué le pasa al fumigar ← `objetivo`; Califica ← `resultado`.
2. **Esperar** 5 s → **Añadir etiqueta** `funnel-alco-finca-cualificacion` → **Nota** ← `nota`
   (trae todas las respuestas).
3. **Si/De lo contrario** según `{{inboundWebhookRequest.califica}}` (llega `true` o `false`):

   - **Califica (`true`)**
     1. Etiqueta `funnel-alco-finca-califica`
     2. Oportunidad → `Calificado (sin cita)`
     3. Notificación interna al asesor con la nota (es un lead de ~$23.000: que lo vea ya)
     4. Esperar 2 h → **Si** NO tiene `funnel-alco-finca-cita` → WhatsApp con el link
        https://alco-funnel.vercel.app/agendar
   - **No califica (`false`)**
     1. Etiqueta `funnel-alco-finca-no-califica`
     2. Oportunidad → `No califica` (la última etapa del pipeline)
     3. Opcional: nutrición (contenido, redes de ALCO). **Sin evento de Meta.**
   - **None** → etiqueta `funnel-alco-finca-revisar` + notificación interna. No la dejes vacía.

**Quién no califica** (`src/utils/qualification.ts`): solo quien responde "No tengo finca, solo
quiero informarme" o "Por ahora no tengo cómo invertir". Fincas de menos de 30 ha **sí** califican.
El cultivo, cómo fumiga y la provincia son información para el asesor.

**Valores que pueden llegar** (en `*_label`, tal cual):

| Pregunta | Opciones |
|---|---|
| Finca | Sí, tengo mi finca en producción · Administro o manejo la finca de mi familia o de un socio · No tengo finca, solo quiero informarme |
| Cultivo | Banano o plátano · Cacao · Arroz · Maíz · Otro cultivo |
| Hectáreas | Menos de 30 ha · Entre 30 y 50 ha · Entre 50 y 100 ha · Más de 100 ha |
| Cómo fumiga hoy | Contrato un servicio externo (dron, avioneta o cuadrilla) · Con mi gente: bomba de mochila o tractor · Ya tengo dron y quiero otro o renovarlo |
| Provincia | Guayas · Los Ríos · El Oro · Manabí · Otra provincia |
| Inversión | Tengo el capital para comprarlo · Con financiamiento o crédito · Por ahora no tengo cómo invertir |

Si prefieres usar campos de tipo desplegable en vez de texto, ponles exactamente estas opciones.

---

## 3. Recordatorios de la reunión (workflow aparte)

**Trigger:** Cita reservada / Estado de la cita, calendario `p7YsTfZnCmrsX9EMsBRv`.

- Confirmación al reservar (si el calendario no la manda ya)
- Recordatorio 24 h antes y 1 h antes
- Si queda en **No asistió**: WhatsApp para reagendar + tarea para el asesor
- Opcional, para Meta: si queda en **Asistió**, acción Meta Conversion API con el evento
  personalizado `Asistio`. La landing no manda este evento, así que no se duplica.

---

## 4. Venta cerrada → Meta (workflow aparte)

Sirve para que Meta aprenda qué leads terminan comprando un dron, no solo cuáles agendan.

1. **Trigger:** Etapa del pipeline cambiada → pipeline "Citas Agendadas (Cierre De Ventas)", etapa
   **Cerrado - Contrato**. Si para ALCO la reserva ya cuenta como venta, usa **Pago de Reserva**,
   pero solo una de las dos, para no mandar dos compras por el mismo cliente. Por confirmar con ALCO.
2. **Meta Conversion API:**
   - Evento `Purchase`. Este funnel no cobra en la landing, así que no hay duplicado.
   - Valor ← el valor de la oportunidad (el asesor lo pone al cerrar). Nunca un valor fijo.
     Moneda USD.
   - FBCLID ← el campo estándar **FB clid** del contacto.
   - Sin Event ID: este evento solo sale de GHL.

Para que funcione, el workflow de contacto tiene que haber guardado el FB clid (paso 1).

---

## Probar

1. **Muestras para mapear.** El trigger del webhook necesita recibir algo para mostrar los campos.
   Con el permiso de ALCO, corre (crea el contacto `prueba.califica@bakano-test.com`):
   ```bash
   pnpm dev --port 5174 --strictPort
   python3 ~/.claude/skills/landings-vsl/scripts/e2e_funnel.py --base http://localhost:5174 --steps e2e/agenda.json --mode ghl
   ```
   Captura la muestra en **cada** workflow. El de contacto recibe primero `registro` y después
   `cita_agendada`: usa la de `registro` para mapear.
2. **Revisa en GHL** el contacto de prueba:
   - existe **uno solo**, con el teléfono `+593…` y el país;
   - tiene las notas de registro, cualificación y cita;
   - tiene las etiquetas `funnel-alco-finca`, `-registro`, `-cualificacion`, `-califica` y `-cita`;
   - los campos están llenos: FB clid `TEST_e2e`, UTM Campaign `TEST-e2e`, país y las respuestas
     de la cualificación con su texto;
   - hay **una sola** oportunidad, en "Citas Agendadas (Cierre De Ventas)" → **Agendo Llamada**
     (no retrocedió);
   - el historial de los dos workflows no tiene errores y ninguno pasó por la rama None.
3. **No califica:** copia `e2e/agenda.json`, cambia la respuesta de `finca` a `sin_finca` y repite.
   Debe quedar con la etiqueta `-no-califica` y sin evento Lead en Meta.
4. **Abandono:** abre el registro, escribe solo el email y cierra el formulario. Debe llegar
   `registro_parcial` con la etiqueta `-parcial` en la etapa Registro incompleto.
5. **Borra** los contactos de prueba al terminar.

## Checklist

- [ ] Desduplicación por email/teléfono activa
- [ ] Carpeta "Funnel ALCO finca" con 3 UTM + 8 de cualificación
- [ ] Pipeline "Citas Agendadas (Cierre De Ventas)" con las 4 etapas nuevas (Registro incompleto, Registrado, Calificado (sin cita), No califica)
- [ ] Definido con ALCO qué etapa cuenta como venta (Cerrado - Contrato o Pago de Reserva)
- [ ] Workflow OBTENER CONTACTO con la condición por `etapa` (3 ramas + None)
- [ ] Workflow obtener cualificacion con la condición por `califica` (2 ramas + None)
- [ ] Ningún workflow manda CompleteRegistration / Lead / Schedule a Meta
- [ ] Recordatorios de la cita
- [ ] Workflow de venta cerrada → Purchase
- [ ] Prueba completa (califica, no califica, abandono) y contactos de prueba borrados

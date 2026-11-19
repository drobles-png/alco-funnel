// Modelo de cualificación del funnel: UNA sola fuente de verdad.
// Para un cliente nuevo solo se editan QUESTIONS, OBJETIVO y la regla de qualifies().
// Salen del cierre del VSL / de lo que el cliente define como "sí es cliente" (no inventar).
//
// Cada respuesta viaja a GHL como `<key>` (valor interno) y `<key>_label` (texto legible:
// es el que se mapea en los campos personalizados). Ver references/contrato-ghl.md de la skill.
// Los `value` son estables: si GHL ya está mapeado, NO renombrarlos (solo agregar).

import { PROVINCIAS } from '@/data/ubicacion'

export interface QuestionOption {
  value: string
  label: string
  /** Solo se muestra a estos perfiles (vacío = a todos) */
  perfiles?: readonly string[]
}

export interface Question {
  key: string
  title: string
  /** Etiqueta corta para la nota del CRM */
  noteLabel: string
  options: readonly QuestionOption[]
  /** Título distinto según el perfil (el prestador "fumiga" cultivos, no los "tiene") */
  titleByPerfil?: Partial<Record<string, string>>
  /** Opción que abre un campo para escribir (ej. "Otro cultivo" → cuál) */
  other?: { value: string; placeholder: string }
  /** 'ubicacion' = provincia + cantón en listas desplegables (cantón en `canton`) */
  kind?: 'ubicacion'
}

export const QUESTIONS = [
  {
    key: 'perfil',
    title: '¿Cuál es tu perfil?',
    noteLabel: 'Perfil',
    options: [
      { value: 'productor', label: 'Productor: tengo o manejo una finca' },
      { value: 'prestador', label: 'Prestador de servicios de fumigación' },
      { value: 'ambos', label: 'Ambos: tengo finca y presto el servicio' },
      { value: 'sin_finca', label: 'No tengo finca, solo quiero informarme' },
    ],
  },
  {
    key: 'cultivo',
    title: '¿Qué cultivo tienes?',
    titleByPerfil: { prestador: '¿Qué cultivo fumigas más?' },
    noteLabel: 'Cultivo',
    other: { value: 'otro', placeholder: 'Escribe tu cultivo' },
    options: [
      { value: 'banano', label: 'Banano o plátano' },
      { value: 'cacao', label: 'Cacao' },
      { value: 'arroz', label: 'Arroz' },
      { value: 'maiz', label: 'Maíz' },
      { value: 'otro', label: 'Otro cultivo' },
    ],
  },
  {
    key: 'hectareas',
    title: '¿Cuántas hectáreas fumigas?',
    noteLabel: 'Hectáreas',
    options: [
      { value: 'ha_menos_30', label: 'Menos de 30 ha' },
      { value: 'ha_30_50', label: 'Entre 30 y 50 ha' },
      { value: 'ha_50_100', label: 'Entre 50 y 100 ha' },
      { value: 'ha_mas_100', label: 'Más de 100 ha' },
    ],
  },
  {
    key: 'fumigacion',
    title: '¿Cómo fumigas hoy?',
    noteLabel: 'Fumiga hoy con',
    options: [
      {
        value: 'servicio_externo',
        label: 'Contrato un servicio externo (dron, avioneta o cuadrilla)',
        perfiles: ['productor', 'ambos'],
      },
      { value: 'personal_propio', label: 'Con mi gente: bomba de mochila o tractor' },
      { value: 'ya_tengo_dron', label: 'Ya tengo dron y quiero otro o renovarlo' },
    ],
  },
  {
    key: 'provincia',
    title: '¿Desde dónde nos escribes?',
    noteLabel: 'Provincia',
    kind: 'ubicacion',
    options: PROVINCIAS.map(({ value, label }) => ({ value, label })),
  },
  {
    key: 'inversion',
    title: '¿Cómo piensas invertir en tu propio dron?',
    noteLabel: 'Inversión',
    options: [
      { value: 'contado', label: 'Tengo el capital para comprarlo' },
      { value: 'financiamiento', label: 'Con financiamiento o crédito' },
      { value: 'sin_presupuesto', label: 'Por ahora no tengo cómo invertir' },
    ],
  },
] as const satisfies readonly Question[]

/** Último paso: pregunta abierta (va a GHL como `objetivo`). */
export const OBJETIVO = {
  title: '¿Qué te pasa hoy cuando tienes que fumigar?',
  placeholder:
    'Ej.: el que me presta el servicio me cambia la fecha y en temporada llega tarde; quiero fumigar el día que yo decida.',
  minWords: 8,
}

export type QuestionKey = (typeof QUESTIONS)[number]['key']
export type Answers = Record<QuestionKey, string>

export const emptyAnswers = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.key, ''])) as Answers

export function labelFor(key: QuestionKey, value: string): string {
  const q: Question | undefined = QUESTIONS.find((x) => x.key === key)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

/** Opciones que ve este perfil (ej. el prestador no "contrata un servicio externo"). */
export function optionsFor(q: Question, perfil: string): readonly QuestionOption[] {
  return q.options.filter((o) => !o.perfiles || o.perfiles.includes(perfil))
}

export const cantonesDe = (provincia: string) =>
  PROVINCIAS.find((p) => p.value === provincia)?.cantones ?? []

// ── Regla de cualificación ────────────────────────────────────────────────────
// Se descarta a quien no tiene finca ("solo quiero informarme") o no tiene cómo invertir
// (ticket promedio ~$23.000). El prestador de servicios SÍ califica (compra el dron para trabajar;
// decidido el 19 nov. 2026). Cultivo, hectáreas, cómo fumiga y provincia no descalifican:
// son info para el asesor. Fincas < 30 ha siguen calificando (el VSL habla de 30, 50, 100 ha
// como ejemplo, no como mínimo).
const DISQUALIFY: Partial<Record<QuestionKey, readonly string[]>> = {
  perfil: ['sin_finca'],
  inversion: ['sin_presupuesto'],
}

export function qualifies(a: Answers): boolean {
  return (Object.keys(DISQUALIFY) as QuestionKey[]).every(
    (k) => !(DISQUALIFY[k] ?? []).includes(a[k]),
  )
}

// Modelo de cualificación del funnel: UNA sola fuente de verdad.
// Para un cliente nuevo solo se editan QUESTIONS, OBJETIVO y la regla de qualifies().
// Salen del cierre del VSL / de lo que el cliente define como "sí es cliente" (no inventar).
//
// Cada respuesta viaja a GHL como `<key>` (valor interno) y `<key>_label` (texto legible:
// es el que se mapea en los campos personalizados). Ver references/contrato-ghl.md de la skill.
// Los `value` son estables: si GHL ya está mapeado, NO renombrarlos (solo agregar).

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  key: string
  title: string
  /** Etiqueta corta para la nota del CRM */
  noteLabel: string
  options: readonly QuestionOption[]
}

export const QUESTIONS = [
  {
    key: 'finca',
    title: '¿Tienes tu finca andando?',
    noteLabel: 'Finca',
    options: [
      { value: 'propia_produccion', label: 'Sí, tengo mi finca en producción' },
      { value: 'administro', label: 'Administro o manejo la finca de mi familia o de un socio' },
      { value: 'sin_finca', label: 'No tengo finca, solo quiero informarme' },
    ],
  },
  {
    key: 'cultivo',
    title: '¿Qué cultivo tienes?',
    noteLabel: 'Cultivo',
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
      { value: 'servicio_externo', label: 'Contrato un servicio externo (dron, avioneta o cuadrilla)' },
      { value: 'personal_propio', label: 'Con mi gente: bomba de mochila o tractor' },
      { value: 'ya_tengo_dron', label: 'Ya tengo dron y quiero otro o renovarlo' },
    ],
  },
  {
    key: 'provincia',
    title: '¿En qué provincia está tu finca?',
    noteLabel: 'Provincia',
    options: [
      { value: 'guayas', label: 'Guayas' },
      { value: 'los_rios', label: 'Los Ríos' },
      { value: 'el_oro', label: 'El Oro' },
      { value: 'manabi', label: 'Manabí' },
      { value: 'otra', label: 'Otra provincia' },
    ],
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
  const q = QUESTIONS.find((x) => x.key === key)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

// ── Regla de cualificación ────────────────────────────────────────────────────
// Se descarta a quien no tiene finca ("solo quiero informarme") o no tiene cómo invertir
// (ticket promedio ~$23.000). Cultivo, hectáreas, cómo fumiga y provincia no descalifican:
// son info para el asesor. Fincas < 30 ha siguen calificando (el VSL habla de 30, 50, 100 ha
// como ejemplo, no como mínimo).
const DISQUALIFY: Partial<Record<QuestionKey, readonly string[]>> = {
  finca: ['sin_finca'],
  inversion: ['sin_presupuesto'],
}

export function qualifies(a: Answers): boolean {
  return (Object.keys(DISQUALIFY) as QuestionKey[]).every(
    (k) => !(DISQUALIFY[k] ?? []).includes(a[k]),
  )
}

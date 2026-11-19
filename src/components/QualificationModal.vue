<script setup lang="ts">
/**
 * Cualificación (wizard, una pregunta por paso + pregunta abierta + consentimiento).
 * Envía a GHL (webhook cualificación) con `califica` (bool), `resultado` (CALIFICA/NO_CALIFICA)
 * y cada respuesta con su `*_label`. Si califica: Lead en Pixel + CAPI con el mismo event_id
 * y va a /agendar; si no, a /sin-espacio (cooldown de 24 h).
 * Preguntas y regla: src/utils/qualification.ts.
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GHL_QUALIFICATION_WEBHOOK, IS_LOCAL, STORAGE_PREFIX } from '@/config/funnel'
import { CUALIFICACION } from '@/content/copy'
import { useDialogFocus } from '@/composables/useDialogFocus'
import { useContactStore } from '@/stores/contact'
import { sendCapiEvent } from '@/utils/capi'
import { buildPayload, fbq, generateEventId, postToGhl } from '@/utils/ghl'
import {
  OBJETIVO,
  QUESTIONS,
  cantonesDe,
  emptyAnswers,
  labelFor,
  optionsFor,
  qualifies,
  type Answers,
  type Question,
  type QuestionKey,
} from '@/utils/qualification'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const contactStore = useContactStore()

// Vista tipada de las preguntas (con los campos opcionales de Question)
type Q = Question & { key: QuestionKey }
const QS: readonly Q[] = QUESTIONS
const TOTAL_STEPS = QS.length + 1
const step = ref(1)
const answers = ref<Answers>(emptyAnswers())
const otros = ref<Record<string, string>>({}) // texto de la opción "Otro" (ej. cultivo)
const canton = ref('')
const objetivo = ref('')
const consent = ref(false)
const touched = ref(false)
const submitting = ref(false)

const modalEl = ref<HTMLElement | null>(null)
const { focusWithin } = useDialogFocus(modalEl, () => props.open, '.q-option input')

const question = computed<Q | undefined>(() => QS[step.value - 1])
const options = computed(() => (question.value ? optionsFor(question.value, answers.value.perfil) : []))
const cantones = computed(() => cantonesDe(answers.value.provincia))
const titleOf = (q: Q) => q.titleByPerfil?.[answers.value.perfil] ?? q.title
const isOther = (q: Q) => !!q.other && answers.value[q.key] === q.other.value

function stepComplete(q: Q): boolean {
  const v = answers.value[q.key]
  if (!v) return false
  if (q.kind === 'ubicacion') return !!canton.value
  // Una respuesta que este perfil ya no ve (cambió de perfil al volver atrás) no cuenta
  if (!optionsFor(q, answers.value.perfil).some((o) => o.value === v)) return false
  return !isOther(q) || !!otros.value[q.key]?.trim()
}

/** Texto para la nota y `*_label`: "Otro cultivo: pitahaya" si escribió cuál. */
function labelOf(q: Q): string {
  const base = labelFor(q.key, answers.value[q.key])
  return isOther(q) ? `${base}: ${otros.value[q.key].trim()}` : base
}
const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length
const objetivoOk = computed(() => wordCount(objetivo.value) >= OBJETIVO.minWords)
const currentHasValue = () => (question.value ? stepComplete(question.value) : false)

// ── Navegación: clic/Espacio elige y avanza; las flechas eligen sin avanzar ───
let advanceTimer: ReturnType<typeof setTimeout> | undefined
let arrowNav = false
let keyboardUser = false
const onDocKeydown = () => (keyboardUser = true)
const onDocPointer = () => (keyboardUser = false)

function goTo(n: number) {
  clearTimeout(advanceTimer)
  step.value = Math.min(Math.max(n, 1), TOTAL_STEPS)
  modalEl.value?.scrollTo({ top: 0 })
}

function onOptionChange(key: QuestionKey, value: string) {
  answers.value[key] = value
  // "Otro": no avanza, espera a que escriba cuál
  if (question.value && isOther(question.value)) {
    arrowNav = false
    clearTimeout(advanceTimer)
    nextTick(() => focusWithin('.q-other input'))
    return
  }
  if (arrowNav) {
    arrowNav = false
    return
  }
  clearTimeout(advanceTimer)
  advanceTimer = setTimeout(() => goTo(step.value + 1), 250)
}

function onProvinciaChange() {
  canton.value = ''
}

function onOptionKeydown(e: KeyboardEvent) {
  if (e.key.startsWith('Arrow')) arrowNav = true
  if (e.key === 'Enter' && currentHasValue()) {
    e.preventDefault()
    goTo(step.value + 1)
  }
}

// El foco va al primer control del paso nuevo (solo con teclado: en el celular no abre el teclado)
function onStepEnter() {
  if (!keyboardUser) return
  focusWithin('.q-option.is-selected input') ?? focusWithin('.q-option input, .q-textarea')
}

// ── Envío ─────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  touched.value = true
  const complete = QS.every(stepComplete)
  if (!complete || !objetivoOk.value || !consent.value) return
  submitting.value = true

  const c = contactStore.get()
  const a = answers.value
  const califica = qualifies(a)
  const resultado = califica ? 'CALIFICA' : 'NO_CALIFICA'
  const eventId = generateEventId('cualificacion')
  const labels = Object.fromEntries(QS.map((q) => [`${q.key}_label`, labelOf(q)]))
  const cantonLabel = cantones.value.find((x) => x.value === canton.value)?.label ?? ''
  const nota = QS.flatMap((q) =>
    q.kind === 'ubicacion'
      ? [[q.noteLabel, labelOf(q)], ['Cantón', cantonLabel]]
      : [[q.noteLabel, labelOf(q)]],
  )

  await postToGhl(
    GHL_QUALIFICATION_WEBHOOK,
    buildPayload('cualificacion', c, {
      tags: ['step-2-cualificacion', califica ? 'califica' : 'no-califica', `perfil-${a.perfil}`],
      titulo: califica ? '✅ CALIFICA' : '❌ NO CALIFICA',
      detalle: {
        ...Object.fromEntries(nota),
        Objetivo: objetivo.value.trim(),
        Resultado: resultado,
      },
      eventId,
      extra: {
        ...a,
        ...labels,
        canton: canton.value,
        canton_label: cantonLabel,
        cultivo_otro: otros.value.cultivo?.trim() ?? '',
        objetivo: objetivo.value.trim(),
        califica,
        resultado,
      },
    }),
  )

  if (califica) {
    const custom = { content_name: 'lead-califica' }
    fbq('track', 'Lead', custom, { eventID: eventId })
    sendCapiEvent(
      'Lead',
      eventId,
      { email: c.email, phone: c.telefono, firstName: c.nombre, lastName: c.apellido },
      custom,
    )
  }

  try {
    localStorage.setItem(`${STORAGE_PREFIX}_qualification`, JSON.stringify({ ...a, canton: canton.value, califica, timestamp: Date.now() }))
    if (!califica && !IS_LOCAL) localStorage.setItem(`${STORAGE_PREFIX}_disq_at`, String(Date.now()))
  } catch {
    /* ignorar */
  }

  submitting.value = false
  emit('close')
  router.push(califica ? '/agendar' : '/sin-espacio')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      step.value = 1
      answers.value = emptyAnswers()
      otros.value = {}
      canton.value = ''
      objetivo.value = ''
      consent.value = false
      touched.value = false
      submitting.value = false
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keydown', onDocKeydown, true)
  document.addEventListener('pointerdown', onDocPointer, true)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('keydown', onDocKeydown, true)
  document.removeEventListener('pointerdown', onDocPointer, true)
  clearTimeout(advanceTimer)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="q-title"
        @click.self="emit('close')"
      >
        <div ref="modalEl" class="modal">
          <button type="button" class="modal__close" aria-label="Cerrar" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>

          <p class="eyebrow">{{ CUALIFICACION.eyebrow }}</p>
          <h2 id="q-title" class="modal__title">{{ CUALIFICACION.title }}</h2>
          <p class="modal__sub">{{ CUALIFICACION.sub }}</p>

          <div class="q-progress">
            <p class="q-progress__label">Pregunta {{ step }} de {{ TOTAL_STEPS }}</p>
            <div
              class="q-progress__track"
              role="progressbar"
              aria-label="Progreso"
              :aria-valuenow="step"
              aria-valuemin="1"
              :aria-valuemax="TOTAL_STEPS"
            >
              <div class="q-progress__fill" :style="{ transform: `scaleX(${step / TOTAL_STEPS})` }" />
            </div>
          </div>

          <form class="q-form" novalidate @submit.prevent="handleSubmit">
            <Transition name="q-step" mode="out-in" @after-enter="onStepEnter">
              <fieldset v-if="question" :key="question.key" class="q-fieldset">
                <legend class="q-legend">{{ titleOf(question) }}</legend>

                <div v-if="question.kind === 'ubicacion'" class="q-ubicacion">
                  <div class="field">
                    <label for="q-provincia">Provincia</label>
                    <select
                      id="q-provincia"
                      v-model="answers[question.key]"
                      data-field="provincia"
                      @change="onProvinciaChange"
                    >
                      <option value="" disabled>Elige tu provincia</option>
                      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="q-canton">Cantón</label>
                    <select id="q-canton" v-model="canton" data-field="canton" :disabled="!cantones.length">
                      <option value="" disabled>
                        {{ cantones.length ? 'Elige tu cantón' : 'Primero elige la provincia' }}
                      </option>
                      <option v-for="c in cantones" :key="c.value" :value="c.value">{{ c.label }}</option>
                    </select>
                  </div>
                </div>

                <div v-else class="q-options" @keydown="onOptionKeydown">
                  <label
                    v-for="opt in options"
                    :key="opt.value"
                    class="q-option"
                    :class="{ 'is-selected': answers[question.key] === opt.value }"
                  >
                    <input
                      type="radio"
                      class="sr-only"
                      :name="question.key"
                      :value="opt.value"
                      :checked="answers[question.key] === opt.value"
                      @change="onOptionChange(question.key, opt.value)"
                    />
                    <span class="q-option__radio" aria-hidden="true" />
                    <span>{{ opt.label }}</span>
                  </label>
                  <div v-if="isOther(question)" class="field q-other">
                    <label :for="`q-${question.key}-otro`" class="sr-only">{{ question.other?.placeholder }}</label>
                    <input
                      :id="`q-${question.key}-otro`"
                      v-model="otros[question.key]"
                      :data-field="`${question.key}_otro`"
                      type="text"
                      maxlength="80"
                      :placeholder="question.other?.placeholder"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset v-else key="final" class="q-fieldset">
                <legend class="q-legend">{{ OBJETIVO.title }}</legend>
                <div class="field" :class="{ 'has-error': touched && !objetivoOk }">
                  <label for="q-objetivo" class="sr-only">{{ OBJETIVO.title }}</label>
                  <textarea
                    id="q-objetivo"
                    v-model="objetivo"
                    class="q-textarea"
                    data-field="objetivo"
                    rows="4"
                    maxlength="1000"
                    :placeholder="OBJETIVO.placeholder"
                    aria-describedby="q-objetivo-hint"
                  />
                  <span id="q-objetivo-hint" :class="touched && !objetivoOk ? 'field__error' : 'q-hint'">
                    {{ wordCount(objetivo) }} de {{ OBJETIVO.minWords }} palabras mínimo
                  </span>
                </div>

                <label class="q-consent" :class="{ 'has-error': touched && !consent }">
                  <input v-model="consent" type="checkbox" data-field="consent" />
                  <span>
                    {{ CUALIFICACION.consent }}
                    <RouterLink to="/politicas-privacidad" target="_blank">política de privacidad</RouterLink>.
                  </span>
                </label>
              </fieldset>
            </Transition>

            <div class="q-nav">
              <button
                type="button"
                class="btn btn--ghost"
                :class="{ 'is-hidden': step <= 1 }"
                :tabindex="step <= 1 ? -1 : 0"
                @click="goTo(step - 1)"
              >
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Atrás
              </button>
              <button
                v-if="step < TOTAL_STEPS && currentHasValue()"
                type="button"
                class="btn btn--ghost"
                @click="goTo(step + 1)"
              >
                Siguiente <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>

            <button
              v-if="step === TOTAL_STEPS"
              type="submit"
              class="btn btn--lg btn--block"
              :disabled="submitting"
            >
              <i
                :class="submitting ? 'fa-solid fa-spinner fa-spin' : 'fa-regular fa-calendar'"
                aria-hidden="true"
              ></i>
              {{ submitting ? 'Enviando…' : CUALIFICACION.submit }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.q-progress {
  margin-bottom: 20px;

  &__label {
    @include eyebrow;
    margin-bottom: 8px;
    color: $ink-muted;
  }

  &__track {
    height: 4px;
    overflow: hidden;
    border-radius: 4px;
    background: $line;
  }

  &__fill {
    height: 100%;
    background: $primary;
    transform-origin: left;
    transition: transform 0.3s ease;
  }
}

.q-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.q-fieldset {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  border: 0;
}

.q-legend {
  margin-bottom: 4px;
  padding: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.q-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.q-option {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 12px 14px;
  border: 1px solid $line;
  border-radius: $radius-md;
  background: $raised;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: $primary;
  }

  &:focus-within {
    @include focus-ring;
  }

  &__radio {
    flex: none;
    width: 18px;
    height: 18px;
    border: 2px solid $line;
    border-radius: 50%;
  }

  &.is-selected {
    border-color: $primary;
    background: $primary-soft;

    .q-option__radio {
      border: 5px solid $primary;
    }
  }
}

.q-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.q-hint {
  color: $ink-muted;
  font-size: 0.8rem;
}

.q-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: $ink-muted;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 2px 0 0;
    accent-color: $primary;
  }

  &.has-error {
    color: $error;
  }
}

.q-nav {
  display: flex;
  justify-content: space-between;
  gap: 8px;

  .is-hidden {
    visibility: hidden;
  }
}

.q-step-enter-active,
.q-step-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.q-step-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.q-step-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>

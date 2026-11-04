<script setup lang="ts">
// Landing (/). Todo el texto sale de LANDING en src/content/copy.ts.
// Cada botón que abre el registro lleva data-cta="registro" (lo usa el e2e).
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import RegistrationModal from '@/components/RegistrationModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { CUPOS_SEMANA, IS_LOCAL, PERSON_NAME, STORAGE_PREFIX } from '@/config/funnel'
import { LANDING } from '@/content/copy'
import { captureFbParams } from '@/utils/fbclid'
import { endOfWeekGye } from '@/utils/week'

const route = useRoute()
const router = useRouter()
const modalOpen = ref(false)
const showSticky = ref(false)
const L = LANDING
const scarcity = CUPOS_SEMANA > 0 ? L.scarcity(CUPOS_SEMANA) : null

function openModal() {
  // Quien no calificó hace menos de 24 h vuelve a /sin-espacio
  if (!IS_LOCAL) {
    const disqAt = Number(localStorage.getItem(`${STORAGE_PREFIX}_disq_at`))
    if (disqAt && Date.now() - disqAt < 24 * 60 * 60 * 1000) {
      router.push('/sin-espacio')
      return
    }
  }
  modalOpen.value = true
}

// Contador REAL hasta el cierre de la agenda de la semana (no se reinicia por visitante)
const now = ref(Date.now())
const left = computed(() => {
  const s = Math.max(0, Math.floor((endOfWeekGye(now.value) - now.value) / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    d: Math.floor(s / 86400),
    h: pad(Math.floor(s / 3600) % 24),
    m: pad(Math.floor(s / 60) % 60),
    s: pad(s % 60),
  }
})
let timer: number | undefined

const onScroll = () => (showSticky.value = window.scrollY > 700)

// Revelado suave al hacer scroll (solo si el usuario no pidió menos movimiento)
let io: IntersectionObserver | undefined
onMounted(() => {
  captureFbParams()
  timer = window.setInterval(() => (now.value = Date.now()), 1000)
  window.addEventListener('scroll', onScroll, { passive: true })
  // /?editar=1 (desde "Corregir mis datos") reabre el registro con lo guardado
  if (route.query.editar) modalOpen.value = true

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io?.unobserve(e.target)
        }
      }),
    { rootMargin: '0px 0px -10% 0px' },
  )
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('will-reveal')
    io?.observe(el)
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.clearInterval(timer)
  io?.disconnect()
})
</script>

<template>
  <div class="landing">
    <!-- HERO: logo · contador · promesa · beneficios · video · cupos · CTA · sin costo -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__field" aria-hidden="true"></div>

      <header class="topbar">
        <BrandLogo light />
      </header>
      <div class="countdown">
        <span class="countdown__dot" aria-hidden="true"></span>
        <span class="countdown__label">{{ L.countdownLabel }}</span>
        <span class="countdown__time">
          <template v-if="left.d">
            <b>{{ left.d }}</b><small>d</small><i aria-hidden="true">:</i>
          </template>
          <b>{{ left.h }}</b><small>h</small><i aria-hidden="true">:</i>
          <b>{{ left.m }}</b><small>m</small><i aria-hidden="true">:</i>
          <b>{{ left.s }}</b><small>s</small>
        </span>
      </div>

      <div class="wrap hero__inner">
        <p class="kicker">{{ L.kicker }}</p>
        <h1 id="hero-title" class="hero__title">
          {{ L.headline }} <span class="u-sun">{{ L.headlineAccent }}</span>
        </h1>
        <ul class="benefits" role="list">
          <li v-for="b in L.benefits" :key="b"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ b }}</li>
        </ul>

        <button type="button" class="vsl" data-cta="registro" aria-label="Ver el video completo" @click="openModal">
          <span class="vsl__rows" aria-hidden="true"></span>
          <span class="vsl__ring" aria-hidden="true">
            <span class="vsl__play"><i class="fa-solid fa-play"></i></span>
          </span>
          <span class="vsl__caption">
            <strong>{{ PERSON_NAME }}</strong>
            <span>{{ L.videoCaption }}</span>
          </span>
        </button>

        <p v-if="scarcity" class="scarcity">
          <span class="scarcity__dot" aria-hidden="true"></span>
          <span>{{ scarcity.pre }} <strong>{{ scarcity.n }}</strong> {{ scarcity.post }}</span>
        </p>
        <button type="button" class="btn btn--lg btn--cta" data-cta="registro" @click="openModal">
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i> {{ L.cta }}
        </button>
        <p class="note"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ L.ctaNote }}</p>
      </div>
    </section>

    <!-- EL PROBLEMA: línea de tiempo -->
    <section class="clock" aria-labelledby="clock-title">
      <div class="wrap">
        <div class="head reveal">
          <p class="eyebrow">{{ L.clock.eyebrow }}</p>
          <h2 id="clock-title" class="title">
            {{ L.clock.title }} <span class="u-blue">{{ L.clock.titleAccent }}</span>
          </h2>
          <p class="lead">{{ L.clock.sub }}</p>
        </div>

        <ol class="timeline reveal" role="list">
          <li v-for="d in L.clock.days" :key="d.tag" class="tick" :class="{ 'tick--warn': d.warn }">
            <span class="tick__dot" aria-hidden="true"></span>
            <span class="tick__tag">{{ d.tag }}</span>
            <h3 class="tick__title">{{ d.title }}</h3>
            <p class="tick__text">{{ d.text }}</p>
          </li>
        </ol>

        <aside class="season reveal">
          <i class="fa-solid fa-cloud-showers-heavy season__icon" aria-hidden="true"></i>
          <div>
            <h3 class="season__title">{{ L.clock.season.title }}</h3>
            <p>{{ L.clock.season.text }}</p>
          </div>
        </aside>
      </div>
    </section>

    <!-- QUIÉN TE LO CUENTA -->
    <section class="mentor" aria-labelledby="mentor-title">
      <div class="wrap mentor__inner reveal">
        <div class="mentor__card">
          <span class="mentor__label">{{ L.mentor.yearLabel }}</span>
          <strong>{{ L.mentor.year }}</strong>
        </div>
        <div>
          <p class="eyebrow">{{ L.mentor.eyebrow }}</p>
          <h2 id="mentor-title" class="mentor__name">{{ L.mentor.name }}</h2>
          <p class="mentor__role">{{ L.mentor.role }}</p>
          <ul class="mentor__points" role="list">
            <li v-for="p in L.mentor.points" :key="p">
              <i class="fa-solid fa-circle-check" aria-hidden="true"></i>{{ p }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="closing" aria-labelledby="closing-title">
      <div class="hero__field hero__field--closing" aria-hidden="true"></div>
      <div class="wrap closing__inner reveal">
        <h2 id="closing-title" class="closing__title">
          {{ L.closing.title }} <span class="u-sun">{{ L.closing.titleAccent }}</span>
        </h2>
        <p class="closing__sub">{{ L.closing.sub }}</p>
        <p v-if="scarcity" class="scarcity">
          <span class="scarcity__dot" aria-hidden="true"></span>
          <span>{{ scarcity.pre }} <strong>{{ scarcity.n }}</strong> {{ scarcity.post }}</span>
        </p>
        <button type="button" class="btn btn--lg btn--cta" data-cta="registro" @click="openModal">
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i> {{ L.cta }}
        </button>
        <p class="note"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ L.ctaNote }}</p>
      </div>
    </section>

    <SiteFooter :disclaimer="L.disclaimer" />

    <!-- CTA fijo en celular -->
    <Transition name="sticky">
      <div v-if="showSticky && !modalOpen" class="sticky" role="region" aria-label="Ver el video">
        <div class="sticky__copy">
          <strong>{{ L.sticky.title }}</strong>
          <span>{{ L.sticky.sub }}</span>
        </div>
        <button type="button" class="btn" data-cta="registro" @click="openModal">
          {{ L.sticky.cta }} <i class="fa-solid fa-play" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>

    <RegistrationModal :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
$night: $surface-dark;

// ── Utilidades de la página ──────────────────────────────────────────────────
.u-blue {
  color: $primary;
}
.u-sun {
  color: $sun;
}
.center {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.eyebrow--sun {
  color: $sun;
}
.head {
  max-width: 760px;
  margin-bottom: 40px;

  .eyebrow {
    margin-bottom: 12px;
  }
}
.title {
  font-size: clamp(2rem, 6vw, 3.4rem);
  line-height: 1.02;
}
.lead {
  margin-top: 16px;
  color: $ink-muted;
  font-size: 1.08rem;
  line-height: 1.6;
}

// Surcos del cultivo en perspectiva: líneas verdes que se pierden en el horizonte
@mixin field-rows($opacity: 0.35) {
  position: absolute;
  inset: auto -30% 0;
  height: 62%;
  background: repeating-linear-gradient(
    90deg,
    rgba($leaf-bright, $opacity) 0 2px,
    transparent 2px 46px
  );
  transform: perspective(380px) rotateX(62deg);
  transform-origin: bottom center;
  mask-image: linear-gradient(to top, #000 10%, transparent 85%);
  pointer-events: none;
}


// ── Hero (centrado, estructura de funnel) ────────────────────────────────────
.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(90% 55% at 50% 30%, rgba($primary, 0.55), transparent 70%),
    linear-gradient(180deg, $night 0%, #0e2a45 100%);
  color: $ink-on-dark;
  text-align: center;

  &__field {
    @include field-rows(0.22);

    &--closing {
      height: 70%;
    }
  }

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 860px;
    padding-top: 36px;
    padding-bottom: 64px;
  }

  &__title {
    max-width: 18ch;
    margin-top: 16px;
    font-size: clamp(2.3rem, 8vw, 4.1rem);
    line-height: 1;
  }
}

.topbar {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 16px;

  :deep(.logo) {
    height: 32px;
  }
}

// Barra del contador (real: cierre de la agenda semanal)
.countdown {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 12px;
  padding: 12px 16px;
  border-block: 1px solid rgba($sun, 0.25);
  background: linear-gradient(90deg, rgba($sun, 0.04), rgba($sun, 0.12), rgba($sun, 0.04));

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $sun;
    animation: pulse 1.6s ease-in-out infinite;
  }

  &__label {
    font-size: 0.92rem;
    font-weight: 600;
  }

  &__time {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    font-variant-numeric: tabular-nums;

    b {
      font-family: $font-display;
      font-size: 1.35rem;
      font-weight: 600;
      color: $sun;
    }
    small {
      margin-left: 1px;
      color: $ink-on-dark-muted;
      font-size: 0.75rem;
    }
    i {
      margin: 0 5px;
      color: $ink-on-dark-muted;
      font-style: normal;
    }
  }
}

.kicker {
  @include eyebrow;
  color: $sun;
}

.benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.95rem;
    color: $ink-on-dark;
  }

  i {
    color: $leaf-bright;
    font-size: 0.85rem;
  }
}

// Póster del VSL: pantalla con surcos y aro de play
.vsl {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-top: 32px;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba($sun, 0.3);
  border-radius: $radius-lg;
  background:
    radial-gradient(70% 80% at 50% 35%, rgba($primary, 0.85), transparent 75%),
    linear-gradient(160deg, #123a5e, $night);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  text-align: left;

  &__rows {
    @include field-rows(0.4);
    height: 70%;
  }

  &__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: clamp(110px, 26vw, 170px);
    aspect-ratio: 1;
    border: 2px solid rgba(#fff, 0.45);
    border-radius: 50%;
    background: rgba(#fff, 0.06);
    backdrop-filter: blur(3px);
    transform: translate(-50%, -50%);
    transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &__play {
    display: grid;
    place-items: center;
    width: 46%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: $sun;
    color: $ink;
    font-size: clamp(1.2rem, 4vw, 1.7rem);
    box-shadow: 0 8px 24px rgba($sun, 0.45);

    i {
      margin-left: 4px;
    }
  }

  &:hover &__ring {
    transform: translate(-50%, -50%) scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid $sun;
    outline-offset: 3px;
  }

  &__caption {
    position: absolute;
    left: 16px;
    bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-family: $font-display;
      font-size: 1.05rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    span {
      color: $ink-on-dark-muted;
      font-size: 0.82rem;
    }
  }
}

// Píldora de cupos + CTA + nota (hero y cierre)
.scarcity {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  padding: 8px 14px;
  border: 1px solid rgba($sun, 0.35);
  border-radius: 999px;
  background: rgba($sun, 0.08);
  font-size: 0.92rem;

  strong {
    color: $sun;
  }

  &__dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $sun;
    box-shadow: 0 0 0 4px rgba($sun, 0.2);
  }
}

.btn--cta {
  width: 100%;
  max-width: 460px;
  margin-top: 18px;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
}

.note {
  margin-top: 12px;
  color: $ink-on-dark-muted;
  font-size: 0.85rem;

  i {
    margin-right: 4px;
  }
}

// ── Quién te lo cuenta ───────────────────────────────────────────────────────
.mentor {
  padding: 88px 0;
  border-top: 1px solid $line;
  background: $surface;

  &__inner {
    display: grid;
    gap: 32px;

    @media (min-width: 860px) {
      grid-template-columns: 300px 1fr;
      align-items: center;
      gap: 56px;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;

    @media (min-width: 860px) {
      aspect-ratio: 4 / 3;
    }

    border-radius: $radius-lg;
    background:
      repeating-linear-gradient(90deg, rgba(#fff, 0.06) 0 1px, transparent 1px 28px),
      linear-gradient(160deg, $primary, $night);
    color: #fff;

    strong {
      font-family: $font-display;
      font-size: clamp(4.5rem, 18vw, 6.5rem);
      font-weight: 600;
      line-height: 0.85;
      color: $sun;
    }
  }

  &__label {
    margin-bottom: 8px;
    color: $ink-on-dark-muted;
    font-size: 0.9rem;
  }

  &__name {
    margin-top: 10px;
    font-size: clamp(2.2rem, 6vw, 3rem);
  }

  &__role {
    margin-top: 4px;
    @include eyebrow;
    color: $primary;
  }

  &__points {
    display: grid;
    gap: 12px;
    margin: 22px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      gap: 12px;
      line-height: 1.55;
    }

    i {
      flex: none;
      margin-top: 4px;
      color: $leaf;
    }
  }
}

// ── El reloj ─────────────────────────────────────────────────────────────────
.clock {
  padding: 88px 0;
  background: $raised;
}

.timeline {
  position: relative;
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 860px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding-top: 26px;

    // Riel horizontal que pasa de azul (todo bien) a rojo (la plaga avanza)
    &::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 3px;
      background: linear-gradient(90deg, $primary 0%, $primary 35%, $sun 55%, $error 100%);
    }
  }
}

.tick {
  position: relative;
  padding: 0 0 28px 30px;

  // Riel vertical en celular (en desktop lo dibuja .timeline::before)
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -2px;
    width: 3px;
    background: var(--rail, #{$primary});
  }

  @media (min-width: 860px) {
    padding: 22px 0 0;

    &::before {
      display: none;
    }
  }

  &__dot {
    position: absolute;
    top: 2px;
    left: -10px;
    width: 17px;
    height: 17px;
    border: 3px solid $raised;
    border-radius: 50%;
    background: $primary;
    box-shadow: 0 0 0 2px $primary;

    @media (min-width: 860px) {
      top: -26px;
      left: 0;
    }
  }

  &__tag {
    display: inline-block;
    margin-bottom: 8px;
    padding: 3px 8px;
    border-radius: $radius-sm;
    background: $primary-soft;
    color: $primary;
    @include eyebrow;
  }

  &__title {
    font-size: 1.35rem;
  }

  &__text {
    margin-top: 6px;
    color: $ink-muted;
    line-height: 1.55;
  }

  &--warn {
    --rail: #{$error};

    .tick__dot {
      background: $error;
      box-shadow: 0 0 0 2px $error;
    }
    .tick__tag {
      background: rgba($error, 0.1);
      color: $error;
    }
  }

  &:last-child::before {
    display: none;
  }
}

.season {
  display: flex;
  gap: 18px;
  margin-top: 40px;
  padding: 24px;
  border-radius: $radius-lg;
  background: $night;
  color: $ink-on-dark;

  &__icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    background: rgba($sun, 0.14);
    color: $sun;
    font-size: 1.4rem;
  }

  &__title {
    margin-bottom: 6px;
    color: $sun;
    font-size: 1.3rem;
  }

  p {
    color: $ink-on-dark-muted;
    line-height: 1.6;
  }
}


// ── Cierre ───────────────────────────────────────────────────────────────────
.closing {
  position: relative;
  overflow: hidden;
  padding: 96px 0 120px;
  background: linear-gradient(180deg, $night, #0e2a45);
  color: $ink-on-dark;
  text-align: center;

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .eyebrow {
    margin-bottom: 14px;
  }

  &__title {
    max-width: 16ch;
    font-size: clamp(2.3rem, 7vw, 4rem);
    line-height: 1;
  }

  &__sub {
    max-width: 48ch;
    margin-top: 18px;
    color: $ink-on-dark-muted;
    font-size: 1.08rem;
  }
}


// ── CTA fijo (solo celular) ──────────────────────────────────────────────────
.sticky {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  border: 1px solid rgba(#fff, 0.12);
  border-radius: $radius-lg;
  background: rgba($night, 0.95);
  color: $ink-on-dark;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);

  @media (min-width: 860px) {
    display: none;
  }

  &__copy {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: 0.92rem;
    }
    span {
      color: $ink-on-dark-muted;
      font-size: 0.78rem;
    }
  }

  .btn {
    flex: none;
    min-height: 44px;
    padding: 10px 16px;
  }
}

.sticky-enter-active,
.sticky-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.sticky-enter-from,
.sticky-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

// ── Revelado al hacer scroll (la clase la pone el script solo si hay movimiento) ─
.will-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.will-reveal.is-in {
  opacity: 1;
  transform: none;
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .countdown__dot {
    animation: none;
  }
}
</style>

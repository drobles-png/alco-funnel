<script setup lang="ts">
// Landing (/). Todo el texto sale de LANDING en src/content/copy.ts.
// Cada botón que abre el registro lleva data-cta="registro" (lo usa el e2e).
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import RegistrationModal from '@/components/RegistrationModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { IS_LOCAL, PERSON_NAME, STORAGE_PREFIX } from '@/config/funnel'
import { LANDING } from '@/content/copy'
import { captureFbParams } from '@/utils/fbclid'

const route = useRoute()
const router = useRouter()
const modalOpen = ref(false)
const showSticky = ref(false)
const L = LANDING

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

const onScroll = () => (showSticky.value = window.scrollY > 700)

// Revelado suave al hacer scroll (solo si el usuario no pidió menos movimiento)
let io: IntersectionObserver | undefined
onMounted(() => {
  captureFbParams()
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
  io?.disconnect()
})
</script>

<template>
  <div class="landing">
    <!-- HERO -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__field" aria-hidden="true"></div>
      <div class="hero__sun" aria-hidden="true"></div>

      <header class="topbar wrap">
        <BrandLogo light />
        <span class="topbar__tag"><i class="fa-solid fa-circle" aria-hidden="true"></i>{{ L.topbarTag }}</span>
      </header>

      <div class="wrap hero__inner">
        <div class="hero__copy">
          <p class="kicker">{{ L.kicker }}</p>
          <h1 id="hero-title" class="hero__title">
            <span>{{ L.headline }}</span>
            <span>{{ L.headlineMid }}</span>
            <span class="hero__accent">{{ L.headlineAccent }}</span>
          </h1>
          <p class="hero__sub">{{ L.sub }}</p>
        </div>

        <div class="hero__media">
          <button type="button" class="vsl" data-cta="registro" aria-label="Ver el video completo" @click="openModal">
            <span class="vsl__rows" aria-hidden="true"></span>
            <span class="vsl__badge"><i class="fa-solid fa-video" aria-hidden="true"></i> Video</span>
            <span class="vsl__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
            <span class="vsl__caption">
              <strong>{{ PERSON_NAME }}</strong>
              <span>{{ L.videoCaption }}</span>
            </span>
          </button>
          <div class="hero__cta">
            <button type="button" class="btn btn--lg btn--block" data-cta="registro" @click="openModal">
              <i class="fa-solid fa-play" aria-hidden="true"></i> {{ L.cta }}
            </button>
            <p class="hero__note"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ L.ctaNote }}</p>
          </div>
        </div>
      </div>

      <div class="provinces">
        <div class="wrap provinces__inner">
          <span class="provinces__label">{{ L.provincesLabel }}</span>
          <ul role="list">
            <li v-for="p in L.provinces" :key="p">{{ p }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- EL RELOJ: el problema como línea de tiempo -->
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

    <!-- COMPARACIÓN -->
    <section class="compare" aria-labelledby="compare-title">
      <div class="wrap">
        <div class="head reveal">
          <p class="eyebrow">{{ L.compare.eyebrow }}</p>
          <h2 id="compare-title" class="title">
            {{ L.compare.title }} <span class="u-blue">{{ L.compare.titleAccent }}</span>
          </h2>
        </div>

        <div class="versus reveal">
          <div class="versus__col versus__col--them">
            <p class="versus__head"><i class="fa-solid fa-hourglass-half" aria-hidden="true"></i> {{ L.compare.them }}</p>
            <ul role="list">
              <li v-for="r in L.compare.rows" :key="r.them">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>{{ r.them }}
              </li>
            </ul>
          </div>
          <div class="versus__col versus__col--us">
            <p class="versus__head"><i class="fa-solid fa-helicopter" aria-hidden="true"></i> {{ L.compare.us }}</p>
            <ul role="list">
              <li v-for="r in L.compare.rows" :key="r.us">
                <i class="fa-solid fa-check" aria-hidden="true"></i>{{ r.us }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- OFERTA -->
    <section class="offer" aria-labelledby="offer-title">
      <div class="offer__field" aria-hidden="true"></div>
      <div class="wrap">
        <div class="head head--light reveal">
          <p class="eyebrow eyebrow--sun">{{ L.offer.eyebrow }}</p>
          <h2 id="offer-title" class="title">
            {{ L.offer.title }} <span class="u-sun">{{ L.offer.titleAccent }}</span>
          </h2>
        </div>

        <div class="bento">
          <article class="tile tile--models reveal">
            <p class="tile__tag"><i class="fa-solid fa-circle" aria-hidden="true"></i> {{ L.offer.modelsTitle }}</p>
            <ul class="models" role="list">
              <li v-for="m in L.offer.models" :key="m"><small>Agras</small>{{ m }}</li>
            </ul>
            <p class="tile__text">{{ L.offer.modelsText }}</p>
          </article>

          <article class="tile tile--academy reveal">
            <p class="tile__tag tile__tag--dark">{{ L.offer.academy.tag }}</p>
            <h3 class="tile__title">{{ L.offer.academy.title }}</h3>
            <p class="tile__text">{{ L.offer.academy.text }}</p>
            <blockquote class="tile__quote">“{{ L.offer.academy.quote }}”</blockquote>
          </article>

          <article class="tile tile--support reveal">
            <h3 class="tile__title">{{ L.offer.support.title }}</h3>
            <ul class="support" role="list">
              <li v-for="s in L.offer.support.items" :key="s.text">
                <i :class="['fa-solid', s.icon]" aria-hidden="true"></i>{{ s.text }}
              </li>
            </ul>
          </article>
        </div>

        <div class="center">
          <button type="button" class="btn btn--lg" data-cta="registro" @click="openModal">
            {{ L.offer.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- AUTORIDAD -->
    <section class="authority" aria-label="Sobre ALCO">
      <div class="wrap authority__inner reveal">
        <div class="authority__year">
          <span class="authority__label">{{ L.authority.yearLabel }}</span>
          <strong>{{ L.authority.year }}</strong>
        </div>
        <div class="authority__body">
          <p>{{ L.authority.text }}</p>
          <p class="authority__promise">{{ L.authority.promise }}</p>
          <figure class="authority__quote">
            <blockquote>“{{ L.authority.quote }}”</blockquote>
            <figcaption>{{ L.authority.quoteBy }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ¿ES PARA TI? -->
    <section class="fit" aria-labelledby="fit-title">
      <div class="wrap fit__inner reveal">
        <div>
          <p class="eyebrow">{{ L.fit.eyebrow }}</p>
          <h2 id="fit-title" class="title">{{ L.fit.title }}</h2>
        </div>
        <ul class="fit__list" role="list">
          <li v-for="y in L.fit.yes" :key="y" class="fit__yes">
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span><span class="sr-only">Sí es para ti: </span>{{ y }}</span>
          </li>
          <li class="fit__no">
            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
            <span><span class="sr-only">No es para ti: </span>{{ L.fit.no }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="closing" aria-labelledby="closing-title">
      <div class="hero__field hero__field--closing" aria-hidden="true"></div>
      <div class="wrap closing__inner reveal">
        <p class="eyebrow eyebrow--sun">{{ L.closing.eyebrow }}</p>
        <h2 id="closing-title" class="closing__title">
          {{ L.closing.title }} <span class="u-sun">{{ L.closing.titleAccent }}</span>
        </h2>
        <p class="closing__sub">{{ L.closing.sub }}</p>
        <ul class="agenda" role="list" aria-label="Lo que vemos en la reunión">
          <li v-for="a in L.closing.agenda" :key="a.text">
            <i :class="['fa-solid', a.icon]" aria-hidden="true"></i>{{ a.text }}
          </li>
        </ul>
        <button type="button" class="btn btn--lg" data-cta="registro" @click="openModal">
          <i class="fa-solid fa-play" aria-hidden="true"></i> {{ L.closing.cta }}
        </button>
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

// ── Hero ─────────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(120% 70% at 85% 0%, rgba($primary, 0.75), transparent 60%),
    linear-gradient(180deg, $night 0%, #0e2a45 100%);
  color: $ink-on-dark;

  &__field {
    @include field-rows(0.28);

    &--closing {
      height: 70%;
    }
  }

  &__sun {
    position: absolute;
    top: -140px;
    right: -120px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($sun, 0.35), transparent 65%);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    display: grid;
    gap: 32px;
    padding-top: 24px;
    padding-bottom: 48px;

    @media (min-width: 960px) {
      grid-template-columns: 1.05fr 1fr;
      align-items: center;
      gap: 56px;
      padding-top: 48px;
      padding-bottom: 80px;
    }
  }

  &__title {
    margin-top: 14px;
    font-size: clamp(2.6rem, 9.5vw, 4.9rem);
    line-height: 0.95;

    span {
      display: block;
    }
  }

  &__accent {
    margin-top: 10px;
    color: $sun;
    font-size: 0.62em;
    line-height: 1.05;
  }

  &__sub {
    max-width: 52ch;
    margin-top: 20px;
    color: $ink-on-dark-muted;
    font-size: 1.05rem;
    line-height: 1.6;
  }

  &__cta {
    margin-top: 18px;
  }

  &__note {
    margin-top: 10px;
    color: $ink-on-dark-muted;
    font-size: 0.85rem;
    text-align: center;

    i {
      margin-right: 4px;
    }
  }
}

.topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
  padding-bottom: 18px;

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid rgba(#fff, 0.18);
    border-radius: 999px;
    @include eyebrow;
    color: $ink-on-dark;

    i {
      font-size: 0.45rem;
      color: $leaf-bright;
      animation: pulse 2s ease-in-out infinite;
    }
  }
}

.kicker {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba($sun, 0.14);
  color: $sun !important;
  @include eyebrow;
  color: $ink-on-dark;
}

// Tarjeta del VSL: pantalla con surcos y botón de play amarillo
.vsl {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(#fff, 0.16);
  border-radius: $radius-lg;
  background:
    radial-gradient(80% 90% at 70% 20%, rgba($primary, 0.9), transparent 70%),
    linear-gradient(160deg, #123a5e, $night);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  color: #fff;
  cursor: pointer;
  text-align: left;

  &__rows {
    @include field-rows(0.4);
    height: 70%;
  }

  &__badge {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba($night, 0.7);
    @include eyebrow;
    font-size: 0.7rem;
  }

  &__play {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: $sun;
    color: $ink;
    font-size: 1.6rem;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 12px rgba($sun, 0.22);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    i {
      margin-left: 5px;
    }
  }

  &:hover &__play {
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 0 0 18px rgba($sun, 0.18);
  }

  &:focus-visible {
    @include focus-ring;
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

.provinces {
  position: relative;
  border-top: 1px solid rgba(#fff, 0.1);
  background: rgba($night, 0.85);

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 20px;
    padding-top: 14px;
    padding-bottom: 14px;
  }

  &__label {
    color: $ink-on-dark-muted;
    font-size: 0.8rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 18px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    font-family: $font-display;
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    &:not(:last-child)::after {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      margin-left: 18px;
      border-radius: 50%;
      background: $sun;
      vertical-align: middle;
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

// ── Comparación ──────────────────────────────────────────────────────────────
.compare {
  padding: 88px 0;
  background: $surface;
}

.versus {
  display: grid;
  gap: 16px;

  @media (min-width: 860px) {
    grid-template-columns: 1fr 1.15fr;
    gap: 0;
  }

  &__col {
    padding: 28px 24px;
    border-radius: $radius-lg;

    ul {
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      gap: 12px;
      line-height: 1.5;

      i {
        flex: none;
        margin-top: 4px;
      }
    }

    &--them {
      border: 1px solid $line;
      background: $raised;
      color: $ink-muted;

      i {
        color: $error;
      }

      @media (min-width: 860px) {
        margin: 24px 0;
        border-right: 0;
        border-radius: $radius-lg 0 0 $radius-lg;
      }
    }

    &--us {
      background: $primary;
      color: #fff;
      box-shadow: 0 24px 48px rgba($primary, 0.3);

      i {
        color: $sun;
      }
      li {
        font-weight: 600;
      }
    }
  }

  &__head {
    margin-bottom: 20px;
    font-family: $font-display;
    font-size: 1.3rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;

    .versus__col--us & {
      color: $sun;
    }
  }
}

// ── Oferta (bento) ───────────────────────────────────────────────────────────
.offer {
  position: relative;
  overflow: hidden;
  padding: 88px 0;
  background: $night;
  color: $ink-on-dark;

  &__field {
    @include field-rows(0.12);
    height: 40%;
  }

  .wrap {
    position: relative;
  }
}

.bento {
  display: grid;
  gap: 16px;

  @media (min-width: 860px) {
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: auto auto;
  }
}

.tile {
  padding: 28px 24px;
  border: 1px solid rgba(#fff, 0.1);
  border-radius: $radius-lg;
  background: rgba(#fff, 0.04);

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    @include eyebrow;
    color: $leaf-bright;

    i {
      font-size: 0.45rem;
    }

    &--dark {
      color: $primary;
    }
  }

  &__title {
    margin-top: 10px;
    font-size: 1.5rem;
  }

  &__text {
    margin-top: 12px;
    color: $ink-on-dark-muted;
    line-height: 1.6;
  }

  &__quote {
    margin: 20px 0 0;
    padding-top: 16px;
    border-top: 1px solid rgba($ink, 0.2);
    font-family: $font-display;
    font-size: 1.15rem;
    line-height: 1.3;
    text-transform: uppercase;
  }

  &--models {
    background: linear-gradient(160deg, rgba($primary, 0.55), rgba($primary, 0.15));

    @media (min-width: 860px) {
      grid-row: span 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &--academy {
    background: $sun;
    color: $ink;
    border-color: transparent;

    .tile__text {
      color: rgba($ink, 0.8);
    }
  }
}

.models {
  display: grid;
  gap: 4px;
  margin: 20px 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(#fff, 0.12);
    font-family: $font-display;
    font-size: clamp(3rem, 12vw, 5.2rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.01em;
  }

  small {
    color: $ink-on-dark-muted;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}

.support {
  display: grid;
  gap: 12px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $ink-on-dark;
  }

  i {
    display: grid;
    flex: none;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: $radius-md;
    background: rgba($leaf-bright, 0.14);
    color: $leaf-bright;
  }
}

// ── Autoridad ────────────────────────────────────────────────────────────────
.authority {
  padding: 88px 0;
  background: $raised;

  &__inner {
    display: grid;
    gap: 32px;

    @media (min-width: 860px) {
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 64px;
    }
  }

  &__year {
    display: flex;
    flex-direction: column;

    strong {
      font-family: $font-display;
      font-size: clamp(6rem, 22vw, 11rem);
      font-weight: 600;
      line-height: 0.85;
      color: $primary;
    }
  }

  &__label {
    max-width: 22ch;
    margin-bottom: 10px;
    @include eyebrow;
    color: $ink-muted;
  }

  &__body {
    font-size: 1.1rem;
    line-height: 1.6;

    p + p {
      margin-top: 12px;
    }
  }

  &__promise {
    font-weight: 600;
  }

  &__quote {
    margin: 28px 0 0;
    padding: 20px 22px;
    border-radius: $radius-lg;
    background: $primary-soft;

    blockquote {
      margin: 0;
      font-family: $font-display;
      font-size: 1.5rem;
      line-height: 1.2;
      text-transform: uppercase;
      color: $primary;
    }

    figcaption {
      margin-top: 6px;
      color: $ink-muted;
      font-size: 0.85rem;
    }
  }
}

// ── ¿Es para ti? ─────────────────────────────────────────────────────────────
.fit {
  padding: 80px 0;
  border-top: 1px solid $line;
  background: $surface;

  &__inner {
    display: grid;
    gap: 28px;

    @media (min-width: 860px) {
      grid-template-columns: 1fr 1.6fr;
      gap: 56px;
    }
  }

  &__list {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      gap: 14px;
      padding: 16px 18px;
      border-radius: $radius-md;
      line-height: 1.5;

      i {
        flex: none;
        margin-top: 3px;
        font-size: 1.15rem;
      }
    }
  }

  &__yes {
    border: 1px solid $line;
    background: $raised;

    i {
      color: $leaf;
    }
  }

  &__no {
    color: $ink-muted;

    i {
      color: $error;
    }
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

.agenda {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 28px 0 32px;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid rgba(#fff, 0.18);
    border-radius: 999px;
    background: rgba($night, 0.6);
    font-weight: 600;

    i {
      color: $sun;
    }
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
  .topbar__tag i {
    animation: none;
  }
}
</style>

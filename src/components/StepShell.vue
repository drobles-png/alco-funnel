<script setup lang="ts">
// Marco común de los pasos privados del funnel (/ver-video, /agendar, /cita-confirmada, …)
import BrandLogo from '@/components/BrandLogo.vue'
import SiteFooter from '@/components/SiteFooter.vue'

withDefaults(defineProps<{ step?: string; wide?: boolean }>(), { step: '', wide: false })
</script>

<template>
  <div class="shell">
    <header class="shell__head">
      <RouterLink to="/" class="shell__home" aria-label="Volver al inicio">
        <BrandLogo light />
      </RouterLink>
      <p v-if="step" class="shell__step">{{ step }}</p>
    </header>
    <main class="shell__main" :class="{ 'shell__main--wide': wide }">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 22px 16px 18px;
    background:
      repeating-linear-gradient(90deg, rgba($leaf-bright, 0.12) 0 1px, transparent 1px 40px),
      linear-gradient(180deg, $surface-dark, #0e2a45);
    border-bottom: 3px solid $sun;
  }

  &__home {
    text-decoration: none;
  }

  &__step {
    @include eyebrow;
    color: $sun;
  }

  &__main {
    flex: 1;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 16px 16px 48px;

    &--wide {
      max-width: 880px;
    }
  }
}
</style>

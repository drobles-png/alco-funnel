<script setup lang="ts">
// Wordmark oficial de ALCO (PNG con fondo transparente; originales en alco-landing1/brand).
import { BRAND_NAME } from '@/config/funnel'
import blue from '@/assets/logos/alco-wordmark-blue.png'
import white from '@/assets/logos/alco-wordmark-white.png'

defineProps<{ light?: boolean }>()
</script>

<template>
  <img class="logo" :src="light ? white : blue" :alt="BRAND_NAME" width="900" height="270" />
</template>

<style scoped lang="scss">
.logo {
  display: block;
  height: 28px;
  width: auto;
}
</style>

<script lang="ts" setup>
import { useAppStore } from '~/stores/app'

const app = useAppStore()
</script>

<template>
  <div :class="app.hasLoadedModel ? 'opacity-0' : ''" class="pointer-events-none absolute inset-0 flex items-center justify-center transition duration-600" bg="black">
    <i-ri-ghost-line text="white 8xl" />
  </div>
</template>

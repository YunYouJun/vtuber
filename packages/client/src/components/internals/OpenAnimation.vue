<template>
  <div :class="app.hasLoadedModel ? 'opacity-0' : ''" class="absolute inset-0 flex justify-center items-center transition duration-600 pointer-events-none" bg="black">
    <i-ri-ghost-line text="white 8xl" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '~/stores/app'

const app = useAppStore()
</script>

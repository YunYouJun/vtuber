<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)

defineExpose({
  canvas,
})
</script>

<template>
  <canvas
    id="overlay"
    ref="canvas"
    class="pointer-events-none absolute left-0 top-0 h-full w-full rotate-y-180 transform rounded-full object-cover"
    width="640"
    height="480"
  />
</template>

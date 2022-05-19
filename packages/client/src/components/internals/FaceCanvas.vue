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
    class="
      absolute
      left-0
      top-0
      object-cover
      w-full
      h-full
      rounded-full
      pointer-events-none
      transform
      rotate-y-180
    "
    width="640"
    height="480"
  />
</template>

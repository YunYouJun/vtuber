<script lang="ts" setup>
const showFps = ref(true)
const fps = useFps()
</script>

<template>
  <div :class="showFps ? '' : 'opacity-0'" class="p-2 shadow rounded absolute top-2 left-2 cursor-pointer" @click="showFps = !showFps">
    FPS: {{ fps }}
  </div>
</template>

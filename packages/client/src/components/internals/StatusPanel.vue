<script lang="ts" setup>
const showFps = ref(true)
const fps = useFps()
</script>

<template>
  <div :class="showFps ? '' : 'opacity-0'" class="absolute left-2 top-2 cursor-pointer rounded p-2 shadow" @click="showFps = !showFps">
    FPS: {{ fps }}
  </div>
</template>

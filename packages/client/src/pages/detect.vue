<template>
  <!-- <FaceDetection v-show="vtuberStore.showWebcam" /> -->
  <div class="container" m="auto">
    <video class="input_video hidden" />
    <canvas class="output_canvas w-180 rounded shadow" bg="gray-200" m="auto" />
  </div>
  <div class="absolute left-0 top-0">
    <div class="control-panel " />
  </div>
</template>

<script lang="ts" setup>
// import { useVtuberStore } from '~/stores/vtuber'
// const vtuberStore = useVtuberStore()
import { initHolistic } from '~/setup/holistic'

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.css' },
  ],
})

onMounted(() => {
  initHolistic({
    displayControlPanel: true,
  })
})
</script>

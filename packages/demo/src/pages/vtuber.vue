<template>
  <IconButton
    :active="vtuberStore.showWebcam"
    title="切换 Webcam"
    @click="vtuberStore.toggleWebcam"
  >
    <i-ri-eye-line v-if="vtuberStore.showWebcam" title="显示" />
    <i-ri-eye-close-line v-else title="隐藏" />
  </IconButton>
  <!-- vtuber 容器 -->
  <div id="vtuber-container"></div>
  <div v-show="vtuberStore.showWebcam" id="detect-container">
    <!-- <face-detection /> -->
    <WebCamera />
    <!-- <vtuber-config /> -->
  </div>
</template>

<route lang="yaml">
meta:
  layout: fullscreen
</route>

<script setup lang="ts">
// import { Vtuber } from 'vtuber'

import { useVtuberStore } from '~/stores/vtuber'
const vtuberStore = useVtuberStore()

onMounted(() => {
  // const vtuber = new Vtuber()
  // vtuber.init()
})
</script>

<style lang="scss">
#vtuber-container {
  position: absolute;
  inset: 0;
  z-index: -1;
}

#detect-container {
  position: absolute;
  left: 0;
  bottom: 0;
  // transform: scale(0.6);
}
</style>

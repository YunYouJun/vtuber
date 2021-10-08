<template>
  <!-- vtuber 容器 -->
  <div id="vtuber-container"></div>
  <div v-show="vtuberStore.showWebcam" id="detect-container">
    <!-- <face-detection /> -->
    <WebCamera />
    <!-- <vtuber-config /> -->
  </div>
  <div
    class="
      absolute
      bottom-0
      left-0
      transition
      duration-300
      opacity-0
      hover:opacity-100
      shadow-dark-900
    "
    :class="[presistNav ? 'opacity-100 right-0' : 'oapcity-0 p-2']"
  >
    <NavControls />
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

const presistNav = ref(true)

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

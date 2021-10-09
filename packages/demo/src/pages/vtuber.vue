<template>
  <!-- vtuber 容器 -->
  <div id="vtuber-container" ref="vtuberContainer"></div>
  <FaceDetection v-show="vtuberStore.showWebcam" />
  <!-- <vtuber-config /> -->
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
import { Vtuber } from 'vtuber'

import { useVtuberStore } from '~/stores/vtuber'
const vtuberStore = useVtuberStore()

const presistNav = ref(true)

const vtuberContainer = ref<HTMLDivElement>()

let vtuber: Vtuber

onMounted(() => {
  vtuber = new Vtuber()
  if (vtuberContainer.value) vtuber.init(vtuberContainer.value)
})

onUnmounted(() => {
  vtuber.destroy()
})
</script>

<style lang="scss">
#vtuber-container {
  position: absolute;
  inset: 0;
}
</style>

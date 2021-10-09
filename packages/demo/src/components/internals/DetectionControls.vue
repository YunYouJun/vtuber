<template>
  <IconButton :active="faceStore.detecting" @click="faceStore.toggleDetecting">
    <i-ri-pause-line v-if="faceStore.detecting" />
    <i-ri-play-line v-else />
  </IconButton>
  <IconButton :active="faceStore.options.debug" @click="faceStore.toggleDebug">
    <i-ri-bug-line />
  </IconButton>
  <IconButton
    :active="webcamStore.isFlipped"
    @click="webcamStore.toggleIsFlipped"
  >
    <i-mdi:flip-horizontal />
  </IconButton>
  <IconButton
    :active="faceStore.options.withFaceLandmarks"
    title="标记"
    @click="faceStore.toggleFaceLandmarks"
  >
    <i-ri-bookmark-line />
  </IconButton>
  <IconButton
    :active="faceStore.options.withLandmarkIndex"
    title="索引"
    @click="faceStore.toggleLandmarkIndex"
  >
    <i-ri-list-ordered />
  </IconButton>
</template>

<script setup lang="ts">
import { useFaceStore } from '~/stores/face'
import { useWebcamStore } from '~/stores/webcam'

const faceStore = useFaceStore()
const webcamStore = useWebcamStore()

/**
 * 切换监听状态
 */
// function toggleDetect() {
//   if (detecting.value) {
//     detecting.value = false
//   }
//   else {
//     detecting.value = true
//     onPlay()
//   }
// }
</script>

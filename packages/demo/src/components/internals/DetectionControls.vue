<template>
  <IconButton :active="detecting" @click="toggleDetect">
    <i-ri-play-line v-if="detecting" />
    <i-ri-pause-line v-else />
  </IconButton>
  <IconButton :active="debug" @click="toggleDebug">
    <i-ri-bug-line />
  </IconButton>
  <IconButton
    :active="webcamStore.isFlipped"
    @click="webcamStore.toggleIsFlipped"
  >
    <i-mdi:flip-horizontal />
  </IconButton>
  <IconButton
    :active="withFaceLandmarks"
    title="标记"
    @click="toggleFaceLandmarks"
  >
    <i-ri-bookmark-line />
  </IconButton>
  <IconButton
    :active="withLandmarkIndex"
    title="索引"
    @click="toggleLandmarkIndex"
  >
    <i-ri-list-ordered />
  </IconButton>
</template>

<script setup lang="ts">
import { useWebcamStore } from '~/stores/webcam'

const webcamStore = useWebcamStore()

// 正在监听
const [detecting, toggleDetect] = useToggle()
const [debug, toggleDebug] = useToggle()
const [withFaceLandmarks, toggleFaceLandmarks] = useToggle()
const [withLandmarkIndex, toggleLandmarkIndex] = useToggle()

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

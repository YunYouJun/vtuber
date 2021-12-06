<template>
  <IconButton :active="mpStore.detecting" title="捕捉身体" @click="startDetecting">
    <i-ri-body-scan-line :class="detectLoading ? 'animate-spin' : ''" />
  </IconButton>
  <IconButton :active="vtbStore.loadPercent === 100" title="加载人物模型" :disabled="loading" @click="initVRM">
    <i-ri-file-user-line :class="loading ? 'animate-spin' : ''" />
  </IconButton>
  <!-- <IconButton @click="downloadRecordedPointsFrames">
    <i-ri-download-line />
  </IconButton>
  <IconButton :active="faceStore.options.debug" @click="faceStore.toggleDebug">
    <i-ri-bug-line />
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
  </IconButton> -->
</template>

<script setup lang="ts">
// import { ElMessage } from 'element-plus'
// import { convertRecordedFrameToFrameTrack } from 'vtuber/parse'
import { downloadObjectAsJson } from 'vtuber/utils'
import { useMediapipeStore } from '~/stores/mediapipe'
import { useVtuberStore } from '~/stores/vtuber'
// import { useWebcamStore } from '~/stores/webcam'

const vtbStore = useVtuberStore()
// const webcamStore = useWebcamStore()
const mpStore = useMediapipeStore()

const loading = ref(false)

const detectLoading = ref(false)

/**
   * 开始检测
   * @returns
   */
const startDetecting = () => {
  if (!vtbStore.instance) return

  detectLoading.value = true
  vtbStore.instance.initHolistic()
  detectLoading.value = false
}

const initVRM = () => {
  if (vtbStore.instance) {
    loading.value = true
    vtbStore.instance.initVRM()
  }
}

watch(() => vtbStore.loadPercent, () => {
  if (vtbStore.loadPercent === 100)
    loading.value = false
})

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

/**
 * 下载记录的点 所有序列帧
 */
// const downloadRecordedPointsFrames = async() => {
//   const data = await fetch('/data/rawPoints.json').then(res => res.json())
//   console.log(faceStore.recordedPointsFrames)
//   if (faceStore.recordedPointsFrames && faceStore.recordedPointsFrames.length || data) {
//     // downloadObjectAsJson(convertRecordedFrameToFrameTrack(faceStore.recordedPointsFrames || data), 'vtuber-info')
//     downloadObjectAsJson(convertRecordedFrameToFrameTrack(data), 'vtuber-info')
//   }
//   else {
//     ElMessage.warning({
//       message: '您尚未记录数据',
//       showClose: true,
//     })
//   }
// }
</script>

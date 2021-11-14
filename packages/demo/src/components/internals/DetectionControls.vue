<template>

  <IconButton :active="faceStore.detecting" @click="faceStore.toggleDetecting">
    <i-ri-body-scan-line/>
  </IconButton>
  <IconButton @click="downloadRecordedPointsFrames"><i-ri-download-line /></IconButton>
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
import { ElMessage } from 'element-plus'
import { convertRecordedFrameToFrameTrack } from 'vtuber/parse'
import { downloadObjectAsJson } from 'vtuber/utils'
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

/**
 * 下载记录的点 所有序列帧
 */
const downloadRecordedPointsFrames = async () => {
  const data = await fetch('/data/rawPoints.json').then(res => res.json())
  console.log(data)
  console.log(faceStore.recordedPointsFrames)
  if (faceStore.recordedPointsFrames && faceStore.recordedPointsFrames.length || data) {
    // downloadObjectAsJson(convertRecordedFrameToFrameTrack(faceStore.recordedPointsFrames || data), 'vtuber-info')
    downloadObjectAsJson(convertRecordedFrameToFrameTrack(data), 'vtuber-info')
  } else {
    ElMessage.warning({
      message: '您尚未记录数据',
      showClose: true
    })
  }
}
</script>

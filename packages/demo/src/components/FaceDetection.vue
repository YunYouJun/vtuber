<template>
  <div
    class="video-container rounded-full overflow-hidden object-cover"
    :class="[webcamStore.isFlipped ? 'flip' : '']"
  >
    <video
      id="webcam"
      ref="videoRef"
      class="object-cover min-w-full min-h-full rounded-full"
      autoplay
      controls
      width="640"
      height="480"
    ></video>
    <canvas id="overlay" ref="overlayRef" class="webcam-overlay"></canvas>
  </div>
  <div class="video-control">
    <IconButton :active="detecting" @click="toggleDetect">
      <i-ri-play-line v-if="detecting" />
      <i-ri-pause-line v-else />
    </IconButton>
    <IconButton :active="debug" @click="debug = !debug">
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
      @click="withFaceLandmarks = !withFaceLandmarks"
    >
      <i-ri-bookmark-line />
    </IconButton>
    <IconButton
      :active="withLandmarkIndex"
      title="索引"
      @click="withLandmarkIndex = !withLandmarkIndex"
    >
      <i-ri-list-ordered />
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { Webcam } from 'vtuber/utils/webcam'
import { loadModel } from 'vtuber/detect'
import consola from 'consola'

import { PositionPoint } from 'vtuber/types/index'
// import { useUserMedia, useDevicesList } from '@vueuse/core'
import { useWebcamStore } from '~/stores/webcam'

const webcamStore = useWebcamStore()

const videoRef = ref<HTMLVideoElement | null>(null)
const overlayRef = ref<HTMLCanvasElement | null>(null)
let ctx: null | CanvasRenderingContext2D = null

const minConfidence = ref(0.5)
const withBoxes = ref(false)
const withFaceLandmarks = ref(true)
const withLandmarkIndex = ref(true)

// 正在监听
const detecting = ref(false)

const debug = ref(false)
let webcam: Webcam | null = null

onMounted(async() => {
  await loadModel()
  if (overlayRef.value) {
    ctx = overlayRef.value.getContext('2d')
    ;(ctx as CanvasRenderingContext2D).font = '100px serif'
  }
  initWebcam()
})

/**
 * 初始化 Webcam
 */
async function initWebcam() {
  const videoEl = videoRef.value
  if (!videoEl) return

  webcam = new Webcam(videoEl)
  await webcam.init()

  // videoEl.onloadedmetadata = () => {
  //   this.onPlay();
  // };
}

/**
 * 切换监听状态
 */
function toggleDetect() {
  if (detecting.value) {
    detecting.value = false
  }
  else {
    detecting.value = true
    onPlay()
  }
}

async function onPlay() {
  if (!detecting.value) return

  const videoEl = videoRef.value
  if (!videoEl) return

  if (videoEl.paused || videoEl.ended) setTimeout(() => onPlay(), 100)

  const options = new faceapi.SsdMobilenetv1Options({
    minConfidence: minConfidence.value,
  })

  // we only need single face
  // .detectAllFaces(videoEl, options)
  const results = await faceapi
    .detectSingleFace(videoEl, options)
    .withFaceLandmarks()

  const canvas = overlayRef.value
  if (results && canvas) drawFaceRecognitionResults(results)

  setTimeout(() => onPlay())
}

/**
 * 绘制脸部识别结果
 */
function drawFaceRecognitionResults(
  results: faceapi.WithFaceLandmarks<
  {
    detection: faceapi.FaceDetection
  },
  faceapi.FaceLandmarks68
  >,
) {
  const canvas = overlayRef.value

  if (!canvas || !videoRef.value) return

  const dims = faceapi.matchDimensions(canvas, videoRef.value, true)
  const resizedResults = faceapi.resizeResults(results, dims)

  if (debug.value) consola.log(resizedResults)

  // draw detections
  if (withBoxes.value) faceapi.draw.drawDetections(canvas, resizedResults)

  if (withFaceLandmarks.value) {
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
    // draw text number
    const points = resizedResults.landmarks.positions
    // 挂载到全局，store 管理速度似乎太慢
    window.face = {
      enable: true,
      points,
    }

    // 绘制索引点序号
    if (withLandmarkIndex.value) {
      points.forEach((point: PositionPoint, i: number) => {
        if (ctx) ctx.fillText(i.toString(), point.x, point.y)
      })
    }
  }
}
</script>

<style lang="scss">
video {
  outline: none;
}

.video-control {
  margin: 1rem;
}

#webcam {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
}

.webcam-overlay {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
  pointer-events: none;
}
</style>

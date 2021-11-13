<template>
  <WebCamera
    ref="webCamera"
    :class="[webcamStore.isFlipped ? 'transform rotate-y-180' : '']"
  >
    <FaceCanvas ref="faceCanvas" />
  </WebCamera>
</template>

<script setup lang="ts">
import consola from 'consola'
import * as faceapi from 'face-api.js'
import { drawFaceRecognitionResults, loadModel } from 'vtuber/detect'

// import { useUserMedia, useDevicesList } from '@vueuse/core'
import { useFaceStore } from '~/stores/face'
import { useWebcamStore } from '~/stores/webcam'

const faceStore = useFaceStore()
const webcamStore = useWebcamStore()

const webCamera = ref()
const faceCanvas = ref()

onMounted(async() => {
  await loadModel()
})

watchEffect(() => {
  // if (video.value) video.value.srcObject = stream.value!
  // onPlay(faceStore.options)
  const canvas = faceCanvas.value && faceCanvas.value.canvas
  const video = webCamera.value && webCamera.value.video
  if (faceStore.detecting && canvas && video)
    startDetecting(canvas, video, faceStore.options)
})

// 第一次检测开始的时间
let startTime = ref(0)

/**
 * 当 video 播放时，则检测
 */
async function startDetecting(
  canvas: HTMLCanvasElement,
  videoEl: HTMLVideoElement,
  defaultOptions = {
    debug: false,
    withBoxes: false,
    withFaceLandmarks: true,
    withLandmarkIndex: false,
  },
  faceapiOptions = {
    minConfidence: 0.5,
  },
) {
  if (!faceStore.detecting || !videoEl) {
    startTime.value = 0
    return
  }

  consola.info('Start Detecting')


  const options = new faceapi.SsdMobilenetv1Options({
    minConfidence: faceapiOptions.minConfidence,
  })

  // we only need single face
  // .detectAllFaces(videoEl, options)
  const results = await faceapi
    .detectSingleFace(videoEl, options)
    .withFaceLandmarks()

  if (!startTime.value) startTime.value = new Date().valueOf()
  // 流逝的时间
  const elapsedTime = new Date().valueOf() - startTime.value

  if (results) {
    // 面部的 68 个特征点
    const points = results.landmarks.positions
    // 挂载到全局，store 管理速度似乎太慢
    window.face = {
      enable: true,
      points,
    }
    drawFaceRecognitionResults(canvas, videoEl, results, defaultOptions)


    faceStore.pointsRecording.push(
      {
        time: elapsedTime,
        points
      }
    )
  }

  setTimeout(() => {
    startDetecting(canvas, videoEl, defaultOptions, faceapiOptions)
  })
}
</script>

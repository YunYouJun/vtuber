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
  if (!faceStore.detecting) return
  if (!videoEl) return

  consola.info('Start Detecting')

  const options = new faceapi.SsdMobilenetv1Options({
    minConfidence: faceapiOptions.minConfidence,
  })

  // we only need single face
  // .detectAllFaces(videoEl, options)
  const results = await faceapi
    .detectSingleFace(videoEl, options)
    .withFaceLandmarks()

  if (results)
    drawFaceRecognitionResults(canvas, videoEl, results, defaultOptions)

  setTimeout(() => {
    startDetecting(canvas, videoEl, defaultOptions, faceapiOptions)
  })
}
</script>

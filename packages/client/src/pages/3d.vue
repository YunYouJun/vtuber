<template>
  <div class="preview flex justify-center items-center h-full">
    <div class="max-w-500px inline-flex z-1">
      <el-progress v-if="loadPercent !== 100" type="circle" :percentage="loadPercent" />
    </div>
    <ToggleVrm class="z-1" />
    <WebCamera
      ref="webCamera"
      :class="[webcamStore.isFlipped ? 'transform rotate-y-180' : '']"
    >
      <canvas
        ref="mpCanvasRef"
        class="
          absolute
          left-0
          top-0
          object-cover
          w-full
          h-full
          rounded-full
          pointer-events-none
          transform
          rotate-y-180
        "
      />
    </WebCamera>
    <canvas ref="vrmCanvasRef" class="vrm-canvas absolute top-0 left-0" />
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
  >
    <NavControls />
  </div>
</template>

<script lang="ts" setup>
import { useVtuber } from 'vtuber'
import { modelList } from '@vtuber/shared'
import { useWebcamStore } from '~/stores/webcam'
import { useVtuberStore } from '~/stores/vtuber'

const webcamStore = useWebcamStore()

const webCamera = ref()

const vtuberStore = useVtuberStore()

useHead({
  meta: [{
    name: 'description',
    content: '3D Vtuber Base on kalidokit & mediapipe',
  }],
})

const mpCanvasRef = ref<HTMLCanvasElement>()
const vrmCanvasRef = ref<HTMLCanvasElement>()

const videoRef = computed(() => webCamera.value?.video)

const vtuber = useVtuber({
  mpCanvasRef,
  vrmCanvasRef,
  videoRef,
})

const loadPercent = computed(() => {
  const progress = vtuber.loadModelProgress.value
  let percent = 0
  if (progress)
    percent = Math.floor(progress.loaded / progress.total * 100)
  return percent
})

onMounted(() => {
  vtuber.create({
    // Ashtra
    vrmUrl: vtuberStore.curModelUrl,
  })
})

watch(() => vtuberStore.curModelUrl, (vrmUrl: string) => {
  vtuber.loadVRM({
    url: vrmUrl,
  })
})

</script>

<route lang="yaml">
meta:
  layout: fullscreen
</route>

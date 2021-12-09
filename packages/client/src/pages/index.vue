<template>
  <div class="preview flex justify-center items-center h-full">
    <ToggleVrm v-if="app.showModelList" class="z-1" />

    <div class="max-w-500px inline-flex z-1">
      <el-progress v-if="vtbStore.loadPercent !== 100" type="circle" :percentage="vtbStore.loadPercent" />
    </div>
    <WebCamera
      v-show="vtbStore.showWebcam"
      ref="webCamera"
      :class="[webcamStore.isFlipped ? 'transform rotate-y-180' : '']"
    >
      <canvas
        ref="mpCanvasRef"
        class="
          absolute
          left-0
          right-0
          w-full
          pointer-events-none
          transform
          rotate-y-180
        "
        :style="webcamStore.fitHeight ? { height: '100%' } : { width: '100%' }"
      />
    </WebCamera>
    <canvas
      ref="vrmCanvasRef"
      class="vrm-canvas absolute w-full h-full"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    />
    <div class="absolute top-0 h-1/2 w-full flex justify-center items-center z-10 pointer-events-none" :class="showDragStyle ? ['bg-gray-500 bg-opacity-30 border border-4 border-black border-dashed'] : ''" text="2xl black">
      <span v-show="showDragStyle">Drag .vrm file</span>
    </div>
  </div>

  <NavControls :persist="app.showNavControls" />
  <StatusPanel />

  <OpenAnimation />
</template>

<script lang="ts" setup>
import { useVtuber } from 'vtuber'
import { isDev } from '@vtuber/shared'
import { useWebcamStore } from '~/stores/webcam'
import { useVtuberStore } from '~/stores/vtuber'
import { useAppStore } from '~/stores/app'
import { checkModelFormat } from '~/utils/vrm'
const app = useAppStore()

const webcamStore = useWebcamStore()

const webCamera = ref()

const vtbStore = useVtuberStore()

useHead({
  meta: [{
    name: 'description',
    content: '3D Vtuber Base on kalidokit & mediapipe',
  }],
  script: !isDev
    ? [
      {
        src: 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
        crossorigin: 'anonymous',
      },
    ]
    : [],
})

const mpCanvasRef = ref<HTMLCanvasElement>()
const vrmCanvasRef = ref<HTMLCanvasElement>()

const videoRef = computed(() => webCamera.value?.video)

const vtuber = useVtuber({
  vrmUrl: vtbStore.curModelUrl,
  mpCanvasRef,
  vrmCanvasRef,
  videoRef,
  cdn: !isDev,
})

vtbStore.setInstance(vtuber)

watch(() => vtbStore.curModelUrl, (vrmUrl: string) => {
  vtuber.vrm.load(vrmUrl)
})

onMounted(async() => {
  await vtuber.initVRM()
  app.hasLoadedModel = true
})

const showDragStyle = ref(false)
/**
 * 拖拽
 */
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  showDragStyle.value = true
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  showDragStyle.value = false
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  showDragStyle.value = false

  const fileList = e.dataTransfer?.files
  if (!fileList?.length) return
  if (checkModelFormat(fileList[0]))
    vtuber.vrm.load(URL.createObjectURL(fileList[0]))
}
</script>

<route lang="yaml">
meta:
  layout: fullscreen
</route>

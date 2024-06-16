<script lang="ts" setup>
import { useVtuber } from 'vtuber'
import { isDev } from '@vtuber/shared'
import { ProgressIndicator, ProgressRoot } from 'radix-vue'
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

onMounted(async () => {
  await vtuber.initVRM()
  app.hasLoadedModel = true
})

const showDragStyle = ref(false)
/**
 * 拖拽
 */
function onDragEnter(e: DragEvent) {
  e.preventDefault()
  showDragStyle.value = true
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  showDragStyle.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  showDragStyle.value = false

  const fileList = e.dataTransfer?.files
  if (!fileList?.length)
    return
  if (checkModelFormat(fileList[0]))
    vtuber.vrm.load(URL.createObjectURL(fileList[0]))
}
</script>

<template>
  <div class="preview h-full w-full flex items-center justify-center">
    <ToggleVrm v-if="app.showModelList" class="z-1" />

    <Transition
      enter-active-class="transition-opacity duration-800"
      leave-active-class="transition-opacity duration-800"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="vtbStore.loadPercent !== 100 || vtbStore.loadPercent < 0" flex="~ col" class="fixed z-1 h-full w-full items-center justify-center bg-black bg-opacity-70">
        <OpenAnimation />
        <ProgressRoot

          class="relative h-4 w-full overflow-hidden rounded-full bg-black bg-op-50 shadow sm:h-5 sm:w-[300px]"
          style="transform: translateZ(0)"
        >
          <ProgressIndicator
            class="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full rounded-full bg-white bg-opacity-90 transition-transform duration-[660ms]"
            :style="`transform: translateX(-${100 - vtbStore.loadPercent}%)`"
          />
        </ProgressRoot>

        <div p-4 text-xl text-white font-bold>
          Loading {{ vtbStore.loadPercent }}% ...
        </div>
      </div>
    </Transition>

    <WebCamera
      v-show="vtbStore.showWebcam"
      ref="webCamera"
      :class="[webcamStore.isFlipped ? 'transform rotate-y-180' : '']"
    >
      <canvas
        ref="mpCanvasRef"
        class="pointer-events-none absolute left-0 right-0 w-full rotate-y-180 transform"
        :style="webcamStore.fitHeight ? { height: '100%' } : { width: '100%' }"
      />
    </WebCamera>
    <canvas
      ref="vrmCanvasRef"
      class="vrm-canvas h-full w-full"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    />
    <div class="pointer-events-none absolute top-0 z-10 h-1/2 w-full flex items-center justify-center" :class="showDragStyle ? ['bg-gray-500 bg-opacity-30 border border-4 border-black border-dashed'] : ''" text="2xl black">
      <span v-show="showDragStyle">Drag .vrm file</span>
    </div>
  </div>

  <NavControls :persist="app.showNavControls" />
  <StatusPanel />
</template>

<route lang="yaml">
meta:
  layout: fullscreen
</route>

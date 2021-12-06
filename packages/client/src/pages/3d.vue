<template>
  <div class="preview flex justify-center items-center h-full">
    <div class="max-w-500px inline-flex z-1">
      <el-progress v-if="vtbStore.loadPercent !== 100" type="circle" :percentage="vtbStore.loadPercent" />
    </div>
    <ToggleVrm class="z-1" />
    <WebCamera
      v-if="vtbStore.showWebcam"
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
    <canvas ref="vrmCanvasRef" class="vrm-canvas absolute top-0 left-0" />
  </div>

  <NavControls :persist="true" />
</template>

<script lang="ts" setup>
import { useVtuber } from 'vtuber'
import { useWebcamStore } from '~/stores/webcam'
import { useVtuberStore } from '~/stores/vtuber'

const webcamStore = useWebcamStore()

const webCamera = ref()

const vtbStore = useVtuberStore()

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
  vrmUrl: vtbStore.curModelUrl,
  mpCanvasRef,
  vrmCanvasRef,
  videoRef,
})

vtbStore.setInstance(vtuber)

watch(() => vtbStore.curModelUrl, (vrmUrl: string) => {
  vtuber.loadVRM({
    url: vrmUrl,
  })
})

onMounted(() => {
  vtuber.initVRM()
})

</script>

<route lang="yaml">
meta:
  layout: fullscreen
</route>

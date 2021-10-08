<script setup lang="ts">
// const currentCamera = ref<string>()
// const { videoInputs: cameras } = useDevicesList({
//   requestPermissions: true,
//   onUpdated() {
//     if (!cameras.value.find(i => i.deviceId === currentCamera.value))
//       currentCamera.value = cameras.value[0]?.deviceId
//   },
// })

import { useWebcamStore } from '~/stores/webcam'

// const { stream, enabled } = useUserMedia({
//   videoDeviceId: currentCamera,
// })

const webcamStore = useWebcamStore()

const namespace = 'adv'

const size = useStorage(
  `${namespace}-webcam-size`,
  Math.round(Math.min(window.innerHeight, window.innerWidth / 8)),
)
const position = useStorage(`${namespace}-webcam-pos`, {
  x: window.innerWidth - size.value - 30,
  y: window.innerHeight - size.value - 30,
})

const frame = ref<HTMLDivElement | undefined>()
const handler = ref<HTMLDivElement | undefined>()
const video = ref<HTMLVideoElement | undefined>()

watchEffect(() => {
  // if (video.value) video.value.srcObject = stream.value!
  if (video.value) video.value.srcObject = webcamStore.stream!
})

const { style: containerStyle } = useDraggable(
  frame as unknown as HTMLElement,
  {
    initialValue: position,
  },
)

const { isDragging: handlerDown } = useDraggable(
  handler as unknown as HTMLElement,
  {
    onMove({ x, y }) {
      size.value = Math.max(
        10,
        Math.min(x - position.value.x, y - position.value.y) / 0.8536,
      )
    },
  },
)

const frameStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
}))

const handleStyle = computed(() => ({
  width: '14px',
  height: '14px',
  // 0.5 + 0.5 / sqrt(2)
  top: `${size.value * 0.8536 - 7}px`,
  left: `${size.value * 0.8536 - 7}px`,
  cursor: 'nwse-resize',
}))

function fixPosistion() {
  // move back if the camera is outside of the canvas
  if (position.value.x >= window.innerWidth)
    position.value.x = window.innerWidth - size.value - 30
  if (position.value.y >= window.innerHeight)
    position.value.y = window.innerHeight - size.value - 30
}

useEventListener('resize', fixPosistion)
onMounted(fixPosistion)
</script>

<template>
  <div class="fixed z-10" :style="containerStyle">
    <div
      ref="frame"
      class="
        rounded-full
        shadow-lg
        bg-gray-400 bg-opacity-10
        overflow-hidden
        object-cover
      "
      :style="frameStyle"
    >
      <video
        ref="video"
        autoplay
        muted
        volume="0"
        class="object-cover min-w-full min-h-full rounded-full"
        style="transform: rotateY(180deg)"
      />
    </div>

    <div
      ref="handler"
      class="
        absolute
        bottom-0
        right-0
        rounded-full
        bg-main
        shadow
        opacity-0
        shadow
        z-30
        hover:opacity-100
        dark:(border
        border-true-gray-700)
      "
      :style="handleStyle"
      :class="handlerDown ? '!opacity-100' : ''"
    ></div>
  </div>
</template>

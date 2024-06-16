<script setup lang="ts">
import { useWebcamStore } from '~/stores/webcam'

const webcamStore = useWebcamStore()

const namespace = 'vtb'

const size = useStorage(
  `${namespace}-webcam-size`,
  Math.round(Math.min(globalThis.innerHeight, globalThis.innerWidth / 8)),
)
const position = useStorage(`${namespace}-webcam-pos`, {
  x: globalThis.innerWidth - size.value - 30,
  y: globalThis.innerHeight - size.value - 30,
})

const frame = ref<HTMLElement>()
const handler = ref<HTMLDivElement>()
const video = ref<HTMLVideoElement>()

defineExpose({
  video,
})

watchEffect(() => {
  // if (video.value) video.value.srcObject = stream.value!
  if (video.value)
    video.value.srcObject = webcamStore.stream!
}, { flush: 'post' })

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
  width: '1rem',
  height: '1rem',
  // 0.5 + 0.5 / sqrt(2)
  top: `${size.value * 0.8536 - 7}px`,
  left: `${size.value * 0.8536 - 7}px`,
  cursor: 'nwse-resize',
}))

function fixPosistion() {
  // move back if the camera is outside of the canvas
  if (position.value.x >= globalThis.innerWidth)
    position.value.x = globalThis.innerWidth - size.value - 30
  if (position.value.y >= globalThis.innerHeight)
    position.value.y = globalThis.innerHeight - size.value - 30
}

useEventListener('resize', fixPosistion)
onMounted(fixPosistion)

const isRounded = ref(true)

const videoClass = computed(() => {
  const classes = []
  if (isRounded.value) {
    classes.push('object-cover')
    classes.push('rounded-full')
  }
  if (!webcamStore.show)
    classes.push('invisible')

  return classes
})
</script>

<template>
  <div class="fixed z-10 cursor-move" :style="containerStyle">
    <div
      ref="frame"
      class="flex items-center justify-center overflow-hidden bg-dark-300 bg-opacity-30 shadow-lg"
      :class="isRounded ? ['object-cover', 'rounded-full'] : ''"
      :style="frameStyle"
    >
      <video
        id="webcamVideo"
        ref="video"
        autoplay
        muted
        volume="0"
        class="rotate-y-180 transform"
        :class="videoClass"
        :style="webcamStore.fitHeight ? { height: '100%' } : { width: '100%' }"
      />

      <slot />
    </div>

    <div
      ref="handler"
      class="absolute bottom-0 right-0 z-30 rounded-full bg-gray-100 shadow dark:(border border-gray-300) hover:opacity-100"
      :style="handleStyle"
      :class="[
        handlerDown ? '!opacity-100' : '',
        webcamStore.enabled ? 'bg-green-500' : '',
      ]"
    />
  </div>
</template>

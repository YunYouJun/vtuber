<template>
  <div class="vtuber-container">
    <canvas ref="vtuberCanvasRef" width="640" height="360"></canvas>
  </div>
</template>

<script setup lang="ts">
// import { initVtuber } from 'vtuber/mmd'
const facePoints = computed(() => self.face.points)

const vtuberCanvasRef = ref<HTMLCanvasElement>()
let ctx: null | CanvasRenderingContext2D = null
const centerPoint = ref([75, 75])
const radius = ref(50)
const ratio = ref(2)

onMounted(() => {
  init()
})

function init() {
  const canvas = vtuberCanvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  // setInterval
  setInterval(() => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (facePoints.value && facePoints.value[30]) {
      centerPoint.value = [
        facePoints.value[30].x / ratio.value,
        facePoints.value[30].y / ratio.value,
      ]
    }

    drawVtuber()
  }, 20)
}

function drawVtuber() {
  if (!ctx) return
  const center = centerPoint.value

  const eyeHeight = 12
  const eyeGap = 15
  const eyeRadius = 5

  const mouthHeight = 2
  const mouthRadius = 30

  // arc 默认顺时针

  ctx.beginPath()
  ctx.arc(center[0], center[1], radius.value, 0, Math.PI * 2, true)

  // draw mouth
  ctx.moveTo(center[0] + mouthRadius, center[1] + mouthHeight)
  ctx.arc(center[0], center[1] + mouthHeight, mouthRadius, 0, Math.PI, false)

  // left eye
  ctx.moveTo(center[0] - eyeGap + eyeRadius, center[1] - eyeHeight)
  ctx.arc(
    center[0] - eyeGap,
    center[1] - eyeHeight,
    eyeRadius,
    0,
    Math.PI * 2,
    true,
  )

  // right eye
  ctx.moveTo(center[0] + eyeGap + eyeRadius, center[1] - eyeHeight)
  ctx.arc(
    center[0] + eyeGap,
    center[1] - eyeHeight,
    eyeRadius,
    0,
    Math.PI * 2,
    true,
  ) // 右眼
  ctx.stroke()
}
</script>

<style lang="scss">
.vtuber-container {
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 640px;
  height: 360px;
}

.vtuber-canvas {
  width: 640px;
  height: 360px;
}
</style>

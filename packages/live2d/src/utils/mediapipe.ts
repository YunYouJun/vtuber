import { getVideoElement } from './helper'

// draw connectors and landmarks on output canvas
export const drawResults = async (points) => {
  const guideCanvas = document.querySelector('canvas.guides') as HTMLCanvasElement
  const videoElement = getVideoElement()

  if (!guideCanvas || !videoElement || !points)
    return
  guideCanvas.width = videoElement.videoWidth
  guideCanvas.height = videoElement.videoHeight
  const canvasCtx = guideCanvas.getContext('2d')
  if (!canvasCtx)
    return
  canvasCtx.save()
  canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height)
  // Use `Mediapipe` drawing functions
  drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1,
  })
  if (points && points.length === 478) {
    // draw pupils
    drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
      color: '#ffe603',
      lineWidth: 2,
    })
  }
}

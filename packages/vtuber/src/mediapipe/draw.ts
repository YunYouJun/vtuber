import type { Results } from '@mediapipe/holistic'
import { POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS } from '@mediapipe/holistic'
import * as mpHolistic from '@mediapipe/holistic'

import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'

export function drawResults(canvas: HTMLCanvasElement, video: HTMLVideoElement, results: Results) {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const canvasCtx = canvas.getContext('2d')
  if (!canvasCtx) return

  // Remove landmarks we don't want to draw.
  // removeLandmarks(results)

  canvasCtx.save()
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  /**
   * 绘制瞳孔
   */
  function drawPupil() {
    if (!canvasCtx) return
    if (results.faceLandmarks && results.faceLandmarks.length === 478) {
      drawLandmarks(canvasCtx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
        color: '#ffe603',
        lineWidth: 2,
      })
    }
  }

  /**
   * 绘制姿势标记
   * @returns
   */
  function drawPoseLandmarks() {
    if (!canvasCtx) return
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: 'white',
      lineWidth: 4,
    })
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#ff0364',
      lineWidth: 2,
    })

    // drawLandmarks(
    //   canvasCtx,
    //   Object.values(mpHolistic.POSE_LANDMARKS_LEFT)
    //     .map(index => results.poseLandmarks[index]),
    //   { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' })
    // drawingUtils.drawLandmarks(
    //   canvasCtx,
    //   Object.values(mpHolistic.POSE_LANDMARKS_RIGHT)
    //     .map(index => results.poseLandmarks[index]),
    //   { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' })
  }

  /**
   * 绘制面部标记
   */
  function drawFaceLandmarks() {
    if (!canvasCtx) return
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: '#C0C0C070',
      lineWidth: 1,
    })
  }

  function drawHandLandmarks() {
    if (!canvasCtx) return
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: '#eb1064',
      lineWidth: 5,
    })
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: '#00cff7',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: '#22c3e3',
      lineWidth: 5,
    })
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: '#ff0364',
      lineWidth: 2,
    })
  }

  // draw by mediapipe
  drawPoseLandmarks()
  drawFaceLandmarks()
  drawPupil()
  drawHandLandmarks()
}

/**
 * 移除不想绘制的点
 * @param results
 */
export function removeLandmarks(results: mpHolistic.Results) {
  if (results.poseLandmarks) {
    // face in pose landmarks
    const elements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]
    for (const element of elements)
      delete results.poseLandmarks[element]
  }
}

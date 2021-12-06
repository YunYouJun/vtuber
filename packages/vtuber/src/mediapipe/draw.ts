import type { Results } from '@mediapipe/holistic'
import { POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS } from '@mediapipe/holistic'
import * as mpHolistic from '@mediapipe/holistic'

import { drawConnectors, drawLandmarks, lerp } from '@mediapipe/drawing_utils'
import type { Data } from '@mediapipe/drawing_utils'

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

    // 肘部链接到手
    // Connect elbows to hands. Do this first so that the other graphics will draw
    // on top of these marks.
    // if (results.rightHandLandmarks) {
    //   canvasCtx.strokeStyle = 'green'
    //   connect(canvasCtx, [[
    //     results.poseLandmarks[mpHolistic.POSE_LANDMARKS.RIGHT_ELBOW],
    //     results.rightHandLandmarks[0],
    //   ]])
    // }
    // if (results.leftHandLandmarks) {
    //   canvasCtx.strokeStyle = 'green'
    //   connect(canvasCtx, [[
    //     results.poseLandmarks[mpHolistic.POSE_LANDMARKS.LEFT_ELBOW],
    //     results.leftHandLandmarks[0],
    //   ]])
    // }

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
    // 网格
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: '#C0C0C070',
      lineWidth: 1,
    })

    // 眼睛眉毛
    // drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYE,
    //   { color: 'rgb(0,217,231)' })
    // drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYEBROW,
    //   { color: 'rgb(0,217,231)' })
    // drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYE,
    //   { color: 'rgb(255,138,0)' })
    // drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYEBROW,
    //   { color: 'rgb(255,138,0)' })

    // 轮廓
    drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_FACE_OVAL,
      { color: '#E0E0E0', lineWidth: 4 })
    // drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LIPS,
    //   { color: '#E0E0E0', lineWidth: 5 })
  }

  function drawHandLandmarks() {
    if (!canvasCtx) return
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: '#ff000099',
      lineWidth: 4,
    })
    // 近大远小
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: 'white',
      fillColor: 'rgb(0,217,231)',
      lineWidth: 2,
      radius: (data: Data) => {
        return lerp(data.from!.z!, -0.15, 0.1, 10, 1)
      },
    })
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: '#0000ff99',
      lineWidth: 4,
    })
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: 'white',
      fillColor: 'rgb(255,138,0)',
      lineWidth: 2,
      radius: (data: Data) => {
        return lerp(data.from!.z!, -0.15, 0.1, 10, 1)
      },
    })
  }

  // draw by mediapipe
  drawPoseLandmarks()
  drawFaceLandmarks()
  drawPupil()
  drawHandLandmarks()

  canvasCtx.restore()
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

/**
 * 绘制连接线
 * @param ctx
 * @param connectors
 */
export function connect(
  ctx: CanvasRenderingContext2D,
  connectors:
  Array<[mpHolistic.NormalizedLandmark, mpHolistic.NormalizedLandmark]>):
  void {
  const canvas = ctx.canvas
  for (const connector of connectors) {
    const from = connector[0]
    const to = connector[1]
    if (from && to) {
      if (from.visibility && to.visibility
        && (from.visibility < 0.1 || to.visibility < 0.1))
        continue

      ctx.beginPath()
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height)
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height)
      ctx.stroke()
    }
  }
}
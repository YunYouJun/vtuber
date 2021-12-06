import * as controls from '@mediapipe/control_utils'
import * as drawingUtils from '@mediapipe/drawing_utils'
import * as mpHolistic from '@mediapipe/holistic'
import { createControlPanel } from 'vtuber/mediapipe/control'

const config: mpHolistic.HolisticConfig = {
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${mpHolistic.VERSION}/${file}`
  },
}

/**
 * 初始化
 */
export function initHolistic(options: {
  /**
   * 显示控制面板
   */
  displayControlPanel: boolean
} = {
  displayControlPanel: false,
}) {
  // Our input frames will come from here.
  const videoElement = document.getElementsByClassName('input_video')[0] as HTMLVideoElement
  const canvasElement = document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement

  const canvasCtx = canvasElement.getContext('2d')!

  // We'll add this to our control panel later, but we'll save it here so we can
  // call tick() each time the graph runs.
  const fpsControl = new controls.FPS()

  function onResults(results: mpHolistic.Results): void {
    // Draw the overlays.
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

    // Connect elbows to hands. Do this first so that the other graphics will draw
    // on top of these marks.
    canvasCtx.lineWidth = 5
    if (results.poseLandmarks) {
      if (results.rightHandLandmarks) {
        canvasCtx.strokeStyle = 'white'
        connect(canvasCtx, [[
          results.poseLandmarks[mpHolistic.POSE_LANDMARKS.RIGHT_ELBOW],
          results.rightHandLandmarks[0],
        ]])
      }
      if (results.leftHandLandmarks) {
        canvasCtx.strokeStyle = 'white'
        connect(canvasCtx, [[
          results.poseLandmarks[mpHolistic.POSE_LANDMARKS.LEFT_ELBOW],
          results.leftHandLandmarks[0],
        ]])
      }
    }

    // Hands...
    drawingUtils.drawConnectors(
      canvasCtx, results.rightHandLandmarks, mpHolistic.HAND_CONNECTIONS,
      { color: 'white' })
    drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: 'white',
      fillColor: 'rgb(0,217,231)',
      lineWidth: 2,
      radius: (data: drawingUtils.Data) => {
        return drawingUtils.lerp(data.from!.z!, -0.15, 0.1, 10, 1)
      },
    })
    drawingUtils.drawConnectors(
      canvasCtx, results.leftHandLandmarks, mpHolistic.HAND_CONNECTIONS,
      { color: 'white' })
    drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: 'white',
      fillColor: 'rgb(255,138,0)',
      lineWidth: 2,
      radius: (data: drawingUtils.Data) => {
        return drawingUtils.lerp(data.from!.z!, -0.15, 0.1, 10, 1)
      },
    })

    // Face...
    // drawingUtils.drawConnectors(
    //   canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_TESSELATION,
    //   { color: '#C0C0C070', lineWidth: 1 })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYE,
      { color: 'rgb(0,217,231)' })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYEBROW,
      { color: 'rgb(0,217,231)' })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYE,
      { color: 'rgb(255,138,0)' })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYEBROW,
      { color: 'rgb(255,138,0)' })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_FACE_OVAL,
      { color: '#E0E0E0', lineWidth: 5 })
    drawingUtils.drawConnectors(
      canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LIPS,
      { color: '#E0E0E0', lineWidth: 5 })

    // ea
    // console.log(results.ea)
    drawingUtils.drawConnectors(
      canvasCtx, results.ea, mpHolistic.FACE_GEOMETRY,
      { color: 'red', lineWidth: 10 })

    canvasCtx.restore()
  }

  const holistic = new mpHolistic.Holistic(config)
  holistic.onResults(onResults)

  if (options.displayControlPanel) {
    createControlPanel({
      canvasElement,
      videoElement,
      fpsControl,
      holistic,
    })
  }

  return holistic
}

/**
 * 绘制连接线
 * @param ctx
 * @param connectors
 */
function connect(
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

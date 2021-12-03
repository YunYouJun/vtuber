import * as controls from '@mediapipe/control_utils'
import * as drawingUtils from '@mediapipe/drawing_utils'
import * as mpHolistic from '@mediapipe/holistic'

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
    console.log(results)
    // Remove landmarks we don't want to draw.
    removeLandmarks(results)

    // Update the frame rate.
    if (options.displayControlPanel)
      fpsControl.tick()

    // Draw the overlays.
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

    if (results.segmentationMask) {
      canvasCtx.drawImage(
        results.segmentationMask, 0, 0, canvasElement.width,
        canvasElement.height)

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = 'source-in'
      // This can be a color or a texture or whatever...
      canvasCtx.fillStyle = '#00FF007F'
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = 'destination-atop'
      canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height)

      canvasCtx.globalCompositeOperation = 'source-over'
    }
    else {
      canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height)
    }

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

function removeElements(
  landmarks: mpHolistic.NormalizedLandmarkList, elements: number[]) {
  for (const element of elements)
    delete landmarks[element]
}

function removeLandmarks(results: mpHolistic.Results) {
  if (results.poseLandmarks) {
    removeElements(
      results.poseLandmarks,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22])
  }
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

/**
 * 创建控制面板
 */
function createControlPanel(params: {
  canvasElement: HTMLCanvasElement
  videoElement: HTMLVideoElement
  fpsControl: controls.FPSControl
  holistic: mpHolistic.Holistic
}) {
  const { canvasElement, videoElement, fpsControl, holistic } = params
  const controlsElement
      = document.getElementsByClassName('control-panel')[0] as HTMLDivElement

  // Present a control panel through which the user can manipulate the solution
  // options.
  return new controls
    .ControlPanel(controlsElement, {
      selfieMode: true,
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
    .add([
      new controls.StaticText({ title: 'MediaPipe Holistic' }),
      fpsControl,
      new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
      new controls.SourcePicker({
        onSourceChanged: () => {
        // Resets because the pose gives better results when reset between
        // source changes.
          holistic.reset()
        },
        onFrame:
            async(input: controls.InputImage, size: controls.Rectangle) => {
              const aspect = size.height / size.width
              let width: number, height: number
              if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight
                width = height / aspect
              }
              else {
                width = window.innerWidth
                height = width * aspect
              }
              canvasElement.width = width
              canvasElement.height = height
              await holistic.send({ image: input })
            },
      }),
      new controls.Slider({
        title: 'Model Complexity',
        field: 'modelComplexity',
        discrete: ['Lite', 'Full', 'Heavy'],
      }),
      new controls.Toggle(
        { title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
      new controls.Toggle(
        { title: 'Enable Segmentation', field: 'enableSegmentation' }),
      new controls.Toggle(
        { title: 'Smooth Segmentation', field: 'smoothSegmentation' }),
      new controls.Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01,
      }),
      new controls.Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01,
      }),

    ])
    .on((x) => {
      const options = x as mpHolistic.Options
      videoElement.classList.toggle('selfie', options.selfieMode)
      holistic.setOptions(options)
    })
}

import * as controls from '@mediapipe/control_utils'
import type * as mpHolistic from '@mediapipe/holistic'

/**
 * 创建控制面板
 */
export function createControlPanel(params: {
  canvasElement: HTMLCanvasElement
  videoElement: HTMLVideoElement
  holistic: mpHolistic.Holistic
}) {
  const { canvasElement, videoElement, holistic } = params
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
      new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
      new controls.SourcePicker({
        onSourceChanged: () => {
          // Resets because the pose gives better results when reset between
          // source changes.
          holistic.reset()
        },
        onFrame:
          async (input: controls.InputImage, size: controls.Rectangle) => {
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

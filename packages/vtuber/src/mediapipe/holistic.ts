import type * as m from '@mediapipe/holistic'
// import * as mpHolistic from '@mediapipe/holistic'
// import * as mpHolistic from '../../node_modules/@mediapipe/holistic/holistic.js'

export async function useHolistic(options: {
  cdn?: boolean
} = { cdn: false }) {
  let mpHolistic: typeof m
  if (options.cdn)
    mpHolistic = window as any
  else
    mpHolistic = (await import('@mediapipe/holistic')).default

  const config: m.HolisticConfig = {
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${mpHolistic.VERSION}/${file}`
    },
  }

  const holistic = new mpHolistic.Holistic(config)
  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
    refineFaceLandmarks: true,
  })
  return holistic
}

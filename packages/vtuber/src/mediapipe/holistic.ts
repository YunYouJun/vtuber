import * as mpHolistic from '@mediapipe/holistic'
export function useHolistic() {
  const config: mpHolistic.HolisticConfig = {
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

import { acceptHMRUpdate, defineStore } from 'pinia'
import * as faceapi from 'face-api.js'

export const useFaceStore = defineStore('face', () => {
  const [detecting, toggleDetecting] = useToggle()

  // 记录每次检测的时间和对应的点位置信息
  const pointsRecording: {
    time: number,
    points: faceapi.Point[]
  }[] = []

  const options = reactive({
    debug: false,
    withBoxes: false,
    withFaceLandmarks: true,
    withLandmarkIndex: false,
  })

  const toggleDebug = () => {
    options.debug = !options.debug
  }
  const toggleBoxes = () => {
    options.withBoxes = !options.withBoxes
  }
  const toggleFaceLandmarks = () => {
    options.withFaceLandmarks = !options.withFaceLandmarks
  }
  const toggleLandmarkIndex = () => {
    options.withLandmarkIndex = !options.withLandmarkIndex
  }

  return {
    pointsRecording,

    detecting,
    toggleDetecting,

    options,

    toggleDebug,
    toggleBoxes,
    toggleFaceLandmarks,
    toggleLandmarkIndex,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFaceStore, import.meta.hot))

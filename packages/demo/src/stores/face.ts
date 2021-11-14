import { acceptHMRUpdate, defineStore } from 'pinia'

export interface BasePoint { x: number, y: number }

export interface IKeyframeTrack {
  times: number[],
  values: number[]
}

export interface RecordedFrame {
  time: number,
  points: BasePoint[]
}

export const useFaceStore = defineStore('face', () => {
  const [detecting, toggleDetecting] = useToggle()

  // 记录每次检测的时间和对应的点位置信息
  const recordedPointsFrames: RecordedFrame[] = []

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
    recordedPointsFrames,

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

import { acceptHMRUpdate, defineStore } from 'pinia'

export const useFaceStore = defineStore('face', () => {
  const [detecting, toggleDetecting] = useToggle()

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

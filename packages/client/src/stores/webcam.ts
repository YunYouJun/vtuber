import { namespace } from '@vtuber/shared'
import { acceptHMRUpdate, defineStore } from 'pinia'

const currentCamera = ref<string>()

const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const { stream, enabled } = useUserMedia({
  videoDeviceId: currentCamera,
})

export const useWebcamStore = defineStore('webcam', () => {
  const toggleEnabled = useToggle(enabled)
  const [isFlipped, toggleIsFlipped] = useToggle()
  const [show, toggleShow] = useToggle(true)

  // 摄像头画面是否铺满
  const fitHeight = useStorage(`${namespace}-fitHeight`, false)
  const toggleFitHeight = useToggle(fitHeight)

  return {
    stream,
    enabled,
    show,

    isFlipped,
    fitHeight,
    toggleEnabled,
    toggleIsFlipped,
    toggleFitHeight,
    toggleShow,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWebcamStore, import.meta.hot))

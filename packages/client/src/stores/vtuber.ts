import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'

export const useVtuberStore = defineStore('vtuber', () => {
  /**
   * 是否显示 Webcam 摄像头
   */
  const [showWebcam, toggleShowWebcam] = useToggle(true)

  return {
    showWebcam,
    toggleShowWebcam,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useVtuberStore, import.meta.hot))

import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'
import { modelList } from '@vtuber/shared'

export const useVtuberStore = defineStore('vtuber', () => {
  /**
   * 是否显示 Webcam 摄像头
   */
  const [showWebcam, toggleShowWebcam] = useToggle(true)

  const curModelUrl = ref(modelList[0].url)

  return {
    showWebcam,
    curModelUrl,

    toggleShowWebcam,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useVtuberStore, import.meta.hot))

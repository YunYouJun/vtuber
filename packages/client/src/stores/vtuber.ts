import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'

import { useVtuber } from 'vtuber'
import { isDev, namespace } from '@vtuber/shared'

export const useVtuberStore = defineStore('vtuber', () => {
  const instance = ref<ReturnType<typeof useVtuber>>()

  /**
   * 是否显示 Webcam 摄像头
   */
  const [showWebcam, toggleShowWebcam] = useToggle(true)

  // const curModelUrl = ref(
  //   isDev ? '/models/vrm/xiao-el.vrm' : '/models/vrm/alicia-solid.vrm',
  // )
  const curModelUrl = ref('/models/vrm/alicia-solid.vrm')

  /**
   * 模型加载百分比
   */
  const loadPercent = computed(() => {
    const progress = instance.value && unref(instance.value.loadModelProgress)
    let percent = 0
    if (progress)
      percent = Math.floor(progress.loaded / progress.total * 100)
    return percent
  })

  /**
   * 设置实例
   * @param vtuber
   */
  const setInstance = (vtuber: ReturnType<typeof useVtuber>) => {
    instance.value = vtuber
  }

  return {
    instance,

    showWebcam,
    curModelUrl,
    loadPercent,

    setInstance,
    toggleShowWebcam,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useVtuberStore, import.meta.hot))

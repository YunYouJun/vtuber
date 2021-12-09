import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const [showModelList, toggleShowModelList] = useToggle()
  const [showNavControls, toggleShowNavControls] = useToggle(true)

  const hasLoadedModel = ref(false)

  const [isPicInPic, togglePicInPic] = useToggle()

  return {
    showModelList,
    showNavControls,
    hasLoadedModel,
    isPicInPic,

    toggleShowModelList,
    toggleShowNavControls,
    togglePicInPic,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))

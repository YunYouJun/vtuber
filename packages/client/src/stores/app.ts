import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const [showModelList, toggleShowModelList] = useToggle()
  const [showNavControls, toggleShowNavControls] = useToggle(true)

  const hasLoadedModel = ref(false)

  return {
    showModelList,
    showNavControls,
    hasLoadedModel,

    toggleShowModelList,
    toggleShowNavControls,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))

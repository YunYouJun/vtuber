import { acceptHMRUpdate, defineStore } from 'pinia'

export const useWebcamStore = defineStore('webcam', () => {
  const isFlipped = ref(false)

  function setIsFlipped(val: boolean) {
    isFlipped.value = val
  }

  function toggleIsFlipped() {
    isFlipped.value = !isFlipped.value
  }

  return {
    isFlipped,
    setIsFlipped,
    toggleIsFlipped,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWebcamStore, import.meta.hot))

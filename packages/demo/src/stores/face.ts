import { acceptHMRUpdate, defineStore } from 'pinia'

export const useFaceStore = defineStore('face', () => {
  return {
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFaceStore, import.meta.hot))

import consola from 'consola'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
export * from './animate'

export function useVrm() {
  const loadEvent = createEventHook<GLTF>()
  const progressEvent = createEventHook<ProgressEvent<EventTarget>>()

  return {
    onLoad: loadEvent.on,
    onProgress: progressEvent.on,
    /**
     * VRM 模型链接
     */
    async load(url: string) {
      // Import Character VRM
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      const loader = new GLTFLoader()
      loader.crossOrigin = 'anonymous'
      // Import model from URL, add your own model here
      consola.info(`加载模型：${url}`)
      loader.load(
        url,

        (gltf) => {
          loadEvent.trigger(gltf)
        },

        (progress) => {
          progressEvent.trigger(progress)
        },

        error => console.error(error),
      )
    },
  }
}

import consola from 'consola'
import { createEventHook } from '@vueuse/core'
import { VRM, VRMUtils } from '@pixiv/three-vrm'
export * from './animate'

export function useVrm() {
  const loadEvent = createEventHook<VRM>()
  const progressEvent = createEventHook<ProgressEvent<EventTarget>>()

  return {
    onLoad: loadEvent.on,
    onProgress: progressEvent.on,
    /**
     * VRM 模型链接
     */
    async load(url: string) {
      // Import Character VRM
      const { GLTFLoader } = await import(
        'three/examples/jsm/loaders/GLTFLoader.js'
      )

      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader()
        loader.crossOrigin = 'anonymous'
        // Import model from URL, add your own model here
        consola.info(`加载模型：${url}`)
        loader.load(
          url,

          (gltf) => {
            VRMUtils.removeUnnecessaryJoints(gltf.scene)
            VRM.from(gltf).then((value) => {
              loadEvent.trigger(value)
              resolve(true)
            })
          },

          (progress) => {
            progressEvent.trigger(progress)
          },

          (error) => {
            console.error(error)
            reject(error)
          },
        )
      })
    },
  }
}

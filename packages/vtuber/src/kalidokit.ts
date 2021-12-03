import { ref } from 'vue'
import consola from 'consola'
import * as THREE from 'three'
import { VRM, VRMUtils } from '@pixiv/three-vrm'
import { Holistic } from '@mediapipe/holistic'
import { Camera } from '@mediapipe/camera_utils'
import type { Results } from '@mediapipe/holistic'

import { MaybeRef } from '@vueuse/shared'
import { drawResults } from './mediapipe'
import { animateVRM } from './vrm'

interface VtuberOptions {
  videoRef: MaybeRef<HTMLVideoElement | undefined>
  /**
   * mediapipe 示意画布
   */
  mpCanvasRef: MaybeRef<HTMLCanvasElement | undefined>
  /**
   * THREE.JS 绘制模型画布
   */
  vrmCanvasRef?: MaybeRef<HTMLCanvasElement | undefined>
  /**
   * 调试模式
   */
  debug?: boolean
}

/**
 * Composition API 形式
 * @param options
 * @returns
 */
export function useVtuber(options: VtuberOptions) {
  const { mpCanvasRef, videoRef, vrmCanvasRef } = options
  const loadModelProgress = ref<ProgressEvent<EventTarget>>()

  /* THREE.JS WORLD SETUP */
  let currentVrm: VRM

  let scene: THREE.Scene

  return {
    loadModelProgress,
    /**
     * VRM CHARACTER SETUP
     */
    async initScene(vrmCanvasRef: VtuberOptions['vrmCanvasRef']) {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      const vrmCanvasEl = unref(vrmCanvasRef)

      // renderer
      const webglRendererParams: THREE.WebGLRendererParameters = { alpha: true }
      // 是否绑定到对应 Canvas 还是新建
      if (vrmCanvasEl)
        webglRendererParams.canvas = vrmCanvasEl

      const renderer = new THREE.WebGLRenderer(webglRendererParams)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      if (!vrmCanvasEl)
        document.body.appendChild(renderer.domElement)

      // camera
      const orbitCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
      orbitCamera.position.set(0.0, 1.4, 0.7)

      // controls
      const orbitControls = new OrbitControls(orbitCamera, renderer.domElement)
      orbitControls.screenSpacePanning = true
      orbitControls.target.set(0.0, 1.4, 0.0)
      orbitControls.update()

      // scene
      scene = new THREE.Scene()

      // light
      const light = new THREE.DirectionalLight(0xFFFFFF)
      light.position.set(1.0, 1.0, 1.0).normalize()
      scene.add(light)

      // Main Render Loop
      const clock = new THREE.Clock()

      function animate() {
        requestAnimationFrame(animate)

        if (currentVrm) {
          // Update model to render physics
          currentVrm.update(clock.getDelta())
        }
        renderer.render(scene, orbitCamera)
      }
      animate()

      return {
        renderer,
      }
    },
    async loadVRM(vrmOptions: {
      /**
       * VRM 模型链接
       */
      url: string
    }) {
    // Import Character VRM
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      const loader = new GLTFLoader()
      loader.crossOrigin = 'anonymous'
      // Import model from URL, add your own model here
      loader.load(
        vrmOptions.url,

        (gltf) => {
          VRMUtils.removeUnnecessaryJoints(gltf.scene)

          VRM.from(gltf).then((vrm) => {
            scene.add(vrm.scene)

            if (currentVrm)
              scene.remove(currentVrm.scene)

            currentVrm = vrm
            currentVrm.scene.rotation.y = Math.PI // Rotate model 180deg to face camera
          })
        },

        (progress) => {
          loadModelProgress.value = progress
          if (options.debug)
            consola.info('Loading model...', 100.0 * (progress.loaded / progress.total), '%')
        },

        error => console.error(error),
      )
    },
    create(createOptions: {
      vrmUrl: string
    }) {
      // createVtuber(options)
      const canvasEl = unref(mpCanvasRef)
      const videoEl = unref(videoRef)

      if (!canvasEl) {
        consola.error('canvasEl is not found')
        return
      }

      if (!videoEl) {
        consola.error('videoEl is not found')
        return
      }

      consola.info('Start create Vtuber')

      this.initScene(vrmCanvasRef)

      this.loadVRM({
        url: createOptions.vrmUrl,
      })

      /* SETUP MEDIAPIPE HOLISTIC INSTANCE */

      const onResults = (results: Results) => {
        // Draw landmark guides
        drawResults(canvasEl, videoEl, results)

        // Animate model
        animateVRM(currentVrm, videoEl, results)
      }

      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`
        },
      })

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        refineFaceLandmarks: true,
      })
      // Pass holistic a callback function
      holistic.onResults(onResults)

      // Use `Mediapipe` utils to get camera - lower resolution = higher fps
      const camera = new Camera(videoEl, {
        onFrame: async() => {
          await holistic.send({ image: videoEl })
        },
        width: 640,
        height: 480,
      })
      camera.start()
    },
  }
}

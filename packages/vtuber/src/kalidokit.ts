import { ref, unref } from 'vue'
import consola from 'consola'
import * as THREE from 'three'
import { VRM, VRMUtils } from '@pixiv/three-vrm'

import type { MaybeRef } from '@vueuse/shared'

import type * as mpHolistic from '@mediapipe/holistic'

import type * as CameraUtils from '@mediapipe/camera_utils'
import { drawResults, useHolistic } from './mediapipe'
import { animateVRM, useVrm } from './vrm'

interface VtuberOptions {
  /**
   * 是否使用 CDN
   */
  cdn?: boolean
  /**
   * 初始化时使用的 VRM 模型链接
   */
  vrmUrl?: string
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
  /**
   * 显示控制面板
   */
  displayControlPanel?: boolean
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

  let holistic: mpHolistic.Holistic

  const vrm = useVrm()
  vrm.onLoad((gltf) => {
    VRMUtils.removeUnnecessaryJoints(gltf.scene)
    VRM.from(gltf).then((vrm) => {
      scene.add(vrm.scene)

      if (currentVrm)
        scene.remove(currentVrm.scene)

      currentVrm = vrm
      currentVrm.scene.rotation.y = Math.PI // Rotate model 180deg to face camera
    })
  })
  vrm.onProgress((progress) => {
    loadModelProgress.value = progress
    if (options.debug)
      consola.info('Loading model...', 100.0 * (progress.loaded / progress.total), '%')
  })

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
      const aspect = window.innerWidth / window.innerHeight
      const orbitCamera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000)
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

      /**
       * 重新调整窗口大小
       */
      function onWindowResize() {
        orbitCamera.aspect = window.innerWidth / window.innerHeight
        orbitCamera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      addEventListener('resize', onWindowResize, false)

      return {
        renderer,
      }
    },

    vrm,

    initVRM(vrmOptions?: {
      url?: string
    }) {
      if (!scene)
        this.initScene(vrmCanvasRef)

      const vrmUrl = (vrmOptions && vrmOptions.url) || options.vrmUrl
      if (vrmUrl)
        this.vrm.load(vrmUrl)

      else
        consola.error('缺少 VRM 模型链接')
    },

    /**
     * 初始化 Holistic 检测
     * @returns
     */
    async initHolistic() {
      if (holistic)
        consola.info('Holistic 实例已存在，重新实例化')

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

      consola.info('start holistic...')

      /* SETUP MEDIAPIPE HOLISTIC INSTANCE */

      const onResults = (results: mpHolistic.Results) => {
        // Draw landmark guides
        drawResults(canvasEl, videoEl, results)

        // Animate model
        animateVRM(currentVrm, videoEl, results)
      }

      holistic = await useHolistic()

      // Pass holistic a callback function
      holistic.onResults(onResults)

      // Use `Mediapipe` utils to get camera - lower resolution = higher fps
      // const { Camera } = await import('@mediapipe/camera_utils')
      let cameraUtils: typeof CameraUtils
      if (options.cdn)
        cameraUtils = window as any
      else
        cameraUtils = (await import('@mediapipe/camera_utils')).default

      const camera = new cameraUtils.Camera(videoEl, {
        onFrame: async() => {
          await holistic.send({ image: videoEl })
        },
      })
      camera.start()
    },
  }
}

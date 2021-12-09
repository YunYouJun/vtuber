import { ref, unref } from 'vue'
import consola from 'consola'
import * as THREE from 'three'
import { VRM, VRMUtils } from '@pixiv/three-vrm'

import { useStorage } from '@vueuse/core'
import type { MaybeRef } from '@vueuse/shared'

import type * as mpHolistic from '@mediapipe/holistic'

import type * as CameraUtils from '@mediapipe/camera_utils'
import { drawResults, useHolistic } from './mediapipe'
import { animateVRM, useVrm } from './vrm'
import { useThree } from './three'

export interface VtuberOptions {
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
  storageKey?: string
}

/**
 * Composition API 形式
 * @param options
 * @returns
 */
export function useVtuber(options: VtuberOptions) {
  const {
    mpCanvasRef,
    videoRef,
    vrmCanvasRef,
    storageKey = 'vtuber',
  } = options
  const loadModelProgress = ref<ProgressEvent<EventTarget>>()

  /* THREE.JS WORLD SETUP */
  let currentVrm: VRM

  let scene: THREE.Scene

  let holistic: mpHolistic.Holistic

  const drawMpResults = useStorage(`${storageKey}-draw-mp-results`, false)

  const three = useThree(vrmCanvasRef)
  // Main Render Loop
  const clock = new THREE.Clock()

  three.onAnimate(() => {
    if (currentVrm) {
      // Update model to render physics
      currentVrm.update(clock.getDelta())
    }
  })

  const vrm = useVrm()
  vrm.onLoad((value) => {
    scene.add(value.scene)
    if (currentVrm) scene.remove(currentVrm.scene)
    currentVrm = value
    currentVrm.scene.rotation.y = Math.PI // Rotate model 180deg to face camera
  })
  vrm.onProgress((progress) => {
    loadModelProgress.value = progress
    if (options.debug) {
      consola.info(
        'Loading model...',
        100.0 * (progress.loaded / progress.total),
        '%',
      )
    }
  })

  return {
    drawMpResults,
    loadModelProgress,
    /**
     * VRM CHARACTER SETUP
     */
    initScene() {
      if (!scene) scene = three.loadScene()
    },

    vrm,

    async initVRM(vrmOptions?: { url?: string }) {
      if (!scene) this.initScene()

      const vrmUrl = (vrmOptions && vrmOptions.url) || options.vrmUrl
      if (vrmUrl) await this.vrm.load(vrmUrl)
      else consola.error('缺少 VRM 模型链接')
    },

    /**
     * 初始化 Holistic 检测
     * @returns
     */
    async initHolistic() {
      if (holistic) consola.info('Holistic 实例已存在，重新实例化')

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
        if (drawMpResults.value)
          drawResults(canvasEl, videoEl, results, options.cdn)

        // Animate model
        animateVRM(currentVrm, videoEl, results)
      }

      holistic = await useHolistic({
        cdn: options.cdn,
      })

      // Pass holistic a callback function
      holistic.onResults(onResults)

      // Use `Mediapipe` utils to get camera - lower resolution = higher fps
      // const { Camera } = await import('@mediapipe/camera_utils')
      let cameraUtils: typeof CameraUtils
      if (options.cdn) cameraUtils = window as any
      else cameraUtils = (await import('@mediapipe/camera_utils')).default

      const camera = new cameraUtils.Camera(videoEl, {
        onFrame: async() => {
          await holistic.send({ image: videoEl })
        },
      })
      camera.start()
    },
  }
}

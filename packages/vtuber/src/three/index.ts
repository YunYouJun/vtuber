import * as THREE from 'three'
import { unref } from 'vue'
import { createEventHook } from '@vueuse/core'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import type { VtuberOptions } from '../kalidokit'

export function useThree(vrmCanvasRef: VtuberOptions['vrmCanvasRef']) {
  const animateEvent = createEventHook()

  return {
    loadScene() {
      const vrmCanvasEl = unref(vrmCanvasRef)

      // renderer
      const webglRendererParams: THREE.WebGLRendererParameters = {
        alpha: true,
      }
      // 是否绑定到对应 Canvas 还是新建
      if (vrmCanvasEl) webglRendererParams.canvas = vrmCanvasEl

      const renderer = new THREE.WebGLRenderer(webglRendererParams)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      if (!vrmCanvasEl) document.body.appendChild(renderer.domElement)

      // camera
      const aspect = window.innerWidth / window.innerHeight
      const orbitCamera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000)
      // orbitCamera.position.set(0.0, 1.4, 0.7)
      orbitCamera.position.set(0.0, 6.4, 5.7)

      // scene
      const scene = new THREE.Scene()

      // light
      // const light = new THREE.DirectionalLight(0xFFFFFF, 1)
      // light.position.set(0, 1, 0)
      // light.castShadow = true
      // scene.add(light)

      const directionalLight = new THREE.DirectionalLight(0x887766)
      directionalLight.position.set(-1, 1, 1).normalize()
      scene.add(directionalLight)

      // const ambient = new THREE.AmbientLight(0xFFFFFF)

      // Set up shadow properties for the light
      // light.shadow.mapSize.width = 512 // default
      // light.shadow.mapSize.height = 512 // default
      // light.shadow.camera.near = 0.5 // default
      // light.shadow.camera.far = 500 // default

      // grid
      const gridHelper = new THREE.PolarGridHelper(
        8,
        10,
        8,
        64,
        undefined,
        undefined,
      )
      scene.add(gridHelper)

      // 描边
      // const effect = new OutlineEffect(renderer, {
      //   defaultThickness: 0.001,
      // })

      function createCameraAnimation() {
        if (orbitCamera.position.y > 1.4 && orbitCamera.position.z > 0.7) {
          orbitCamera.position.setY(orbitCamera.position.y - 0.05)
          orbitCamera.position.setZ(orbitCamera.position.z - 0.05)
          orbitCamera.lookAt(0.0, 1.4, 0.0)
          requestAnimationFrame(createCameraAnimation)
        }
        else {
          // controls
          // 播放完镜头动画，再添加控制器
          const orbitControls = new OrbitControls(
            orbitCamera,
            renderer.domElement,
          )
          orbitControls.screenSpacePanning = true
          orbitControls.minDistance = 0
          orbitControls.maxDistance = 30
          orbitControls.target.set(0.0, 1.4, 0.0)
          orbitControls.update()
        }
      }
      createCameraAnimation()

      function animate() {
        requestAnimationFrame(animate)

        // orbitCamera.position.set(0.0, orbitCamera.position.y + 0.1, 0.7)

        animateEvent.trigger(null)
        renderer.render(scene, orbitCamera)
        // effect.render(scene, orbitCamera)
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

      return scene
    },
    onAnimate: animateEvent.on,
  }
}

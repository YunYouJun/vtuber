import consola from 'consola'
import * as THREE from 'three'

import { Point } from 'face-api.js'

import type { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import type Stats from 'three/examples/jsm/libs/stats.module.js'
import type { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import type { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js'
import type {
  MMDPhysics,
  MMDPhysicsHelper,
} from 'three/examples/jsm/animation/MMDPhysics'
import type { CCDIKHelper } from 'three/examples/jsm/animation/CCDIKSolver'

import { generateResultFromPoints, DetectResult, convertRecordedFrameToFrameTrack } from '../parse'

import { getMouthIndex } from '../render/mouth'
import { initGui } from './gui'

/**
 * Webcam 检测得到的数据
 */
export interface ResultData {
  [propName: string]: any
}

let stats: Stats

let helper: MMDAnimationHelper
let ikHelper: CCDIKHelper | undefined
let physics: MMDPhysics | undefined
let physicsHelper: MMDPhysicsHelper | undefined

let mesh: THREE.SkinnedMesh
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let effect: OutlineEffect

/**
 * 头部
 */
let head: THREE.Bone

let clock: THREE.Clock

let mixer: THREE.AnimationMixer

const modelFile = 'models/kizunaai/kizunaai.pmx'

export interface VtuberOptions {
  /**
   * 加载动画
   */
  withAnimation?: boolean
}

/**
 * init vtuber mmd
 */
export async function initVtuber(
  container: HTMLElement,
  options: VtuberOptions = {},
): Promise<{ gui: GUI }> {
  // const Stats = await import('three/examples/jsm/libs/stats.module.js')
  // const { OutlineEffect } = await import('three/examples/jsm/effects/OutlineEffect.js')
  // const { MMDLoader } = await import('three/examples/jsm/loaders/MMDLoader.js')
  // const { MMDAnimationHelper } = await import('three/examples/jsm/animation/MMDAnimationHelper.js')

  clock = new THREE.Clock()

  const [
    { default: Stats },
    { OutlineEffect },
    { MMDLoader },
    { MMDAnimationHelper },
  ] = await Promise.all([
    import('three/examples/jsm/libs/stats.module.js'),
    import('three/examples/jsm/effects/OutlineEffect.js'),
    import('three/examples/jsm/loaders/MMDLoader.js'),
    import('three/examples/jsm/animation/MMDAnimationHelper.js'),
  ])

  return new Promise((resolve) => {
    let gui: GUI | undefined

    window.inited = true

    const defaultOptions = {
      withAnimation: false,
    }

    options = Object.assign(defaultOptions, options)

    camera = new THREE.PerspectiveCamera(
      20,
      globalThis.innerWidth / globalThis.innerHeight,
      1,
      1000,
    )
    camera.position.set(0, 0, 16)

    // scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFFFFFF)

    // grid
    const gridHelper = new THREE.PolarGridHelper(
      30,
      10,
      8,
      64,
      undefined,
      undefined,
    )
    gridHelper.position.y = -18
    scene.add(gridHelper)

    const ambient = new THREE.AmbientLight(0x666666)
    scene.add(ambient)

    const directionalLight = new THREE.DirectionalLight(0x887766)
    directionalLight.position.set(-1, 1, 1).normalize()
    scene.add(directionalLight)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(globalThis.devicePixelRatio)
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight)
    container.appendChild(renderer.domElement)

    effect = new OutlineEffect(renderer, {})

    // STATS
    stats = new (Stats as any)()
    container.appendChild(stats.dom)

    // model
    function onProgress(xhr: ProgressEvent) {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100
        consola.log(`${xhr.type}: ${Math.round(percentComplete)}% downloaded`)
      }
    }

    helper = new MMDAnimationHelper()

    const mmdLoader = new MMDLoader()
    if (options.withAnimation) {
      const vmdFiles = ['models/mmd/vmds/wavefile_v2.vmd']
      mmdLoader.loadWithAnimation(
        modelFile,
        vmdFiles,
        async (mmd) => {
          mesh = mmd.mesh
          mesh.position.y = gridHelper.position.y

          scene.add(mesh)

          helper.add(mesh, { animation: mmd.animation, physics: true })

          createIkHelper()
          createPhysicsHelper()
          bindBones()

          gui = await initGui(helper, effect, ikHelper, physicsHelper)

          resolve({ gui })
        },
        onProgress,
        undefined,
      )
    }
    else {
      mmdLoader.load(modelFile, async (object) => {
        mesh = object
        mesh.position.y = gridHelper.position.y

        scene.add(mesh)

        helper.add(mesh, { physics: true })

        createIkHelper()
        createPhysicsHelper()
        bindBones()

        // setup the THREE.AnimationMixer
        mixer = new THREE.AnimationMixer(mesh);
        // create a ClipAction and set it to play
        const clip = await createAnimationClip()
        const clipAction = mixer.clipAction(clip);
        clipAction.play();

        gui = await initGui(helper, effect, ikHelper, physicsHelper)

        resolve({ gui })
      })
    }

    function createIkHelper() {
      ikHelper = helper.objects.get(mesh)?.ikSolver.createHelper()

      if (ikHelper) {
        ikHelper.visible = false
        scene.add(ikHelper)
      }
    }

    function createPhysicsHelper() {
      physics = helper.objects.get(mesh)?.physics
      physicsHelper = physics?.createHelper()

      if (physicsHelper) {
        physicsHelper.visible = false
        scene.add(physicsHelper)
      }
    }

    function bindBones() {
      // bind bones
      const bones = physics?.mesh.skeleton.bones
      if (bones) {
        // 头部
        head = bones[8]
      }
    }

    addOrbitControls(camera, renderer)

    animate()

    globalThis.addEventListener('resize', onWindowResize, false)
  })
}

// ROTATION
// Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported
function createRotationAboutAxis(name: string, axis: 'x' | 'y' | 'z', times: number[], values: number[]) {
  // set up rotation about x axis
  const dirAxis = new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0);

  const keyframeValues: number[] = []
  for (let i = 0; i < values.length; i++) {
    const value = values[i] * 5;
    console.log(value)
    const q = new THREE.Quaternion().setFromAxisAngle(dirAxis, value)
    keyframeValues.push(q.x)
    keyframeValues.push(q.y)
    keyframeValues.push(q.z)
    keyframeValues.push(q.w)

    // keyframeValues.push(qInitial.x)
    // keyframeValues.push(qInitial.y)
    // keyframeValues.push(qInitial.z)
    // keyframeValues.push(qInitial.w)
  }

  // const quaternionKF = new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, keyframeValues);
  const quaternionKF = new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, Array.from(new Array(values.length).keys()), keyframeValues);
  return quaternionKF
}

/**
 * 创建动画序列
 */
async function createAnimationClip() {
  const tracks = await fetch('/data/vtuber-info.json').then(res => res.json())
  const headName = '.skeleton.bones[8]'

  const xKF = createRotationAboutAxis(headName, 'x', tracks.x.times, tracks.x.values)
  const yKF = createRotationAboutAxis(headName, 'y', tracks.y.times, tracks.y.values)

  const clip = new THREE.AnimationClip('Action', 20, [xKF, yKF])
  return clip
}

/**
 * 添加缩放旋转控制
 */
async function addOrbitControls(camera: THREE.Camera, renderer: THREE.Renderer) {
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 10
  controls.maxDistance = 100
}

/**
 * 重新调整窗口大小
 */
function onWindowResize() {
  camera.aspect = globalThis.innerWidth / globalThis.innerHeight
  camera.updateProjectionMatrix()
  effect.setSize(globalThis.innerWidth, globalThis.innerHeight)
}

/**
 *
 * @param result 检测数据
 */
function render() {
  const delta = clock.getDelta()

  if (mixer) {
    mixer.update(delta);
  }
  helper.update(delta)
  effect.render(scene, camera)
}

/**
 * 根据结果播放动画
 * @param result
 */
export function animate(result?: DetectResult) {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    let result
    if (window.face && window.face.points) {
      result = generateResultFromPoints(window.face.points.map(point => new Point(point.x, point.y)))
    }
    else
      result = window.vtuberResult

    animate(result)
  })
  stats.begin()
  if (result)
    renderWithResult(result)
  else
    render()

  stats.end()
}

export function renderWithResult(result: DetectResult) {
  const { mouth } = result
  if (!mesh.morphTargetInfluences) return
  const mouthIndex = getMouthIndex(mouth)

  /**
   * 旋转头部
   * @param ratio 比例
   */
  function rotateHead(ratio = 5) {
    head.rotation.x = result.head.rotation.x * ratio
    head.rotation.y = result.head.rotation.y * ratio
    head.rotation.z = result.head.rotation.z * ratio
  }

  rotateHead()

  if (mouthIndex)
    mesh.morphTargetInfluences[mouthIndex] = 1

  render()

  // reset
  if (mouthIndex)
    mesh.morphTargetInfluences[mouthIndex] = 0
}

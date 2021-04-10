import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
// @ts-ignore
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper.js";

import { generateResult, DetectResult } from "./parse";

import { getMouthIndex } from "./render/mouth";
import {
  MMDPhysics,
  MMDPhysicsHelper,
} from "three/examples/jsm/animation/MMDPhysics";
import { CCDIKHelper } from "three/examples/jsm/animation/CCDIKSolver";

/**
 * Webcam 检测得到的数据
 */
export interface ResultData {
  [propName: string]: any;
}

let stats: Stats;

let helper: MMDAnimationHelper;
let ikHelper: CCDIKHelper | undefined;
let physics: MMDPhysics | undefined;
let physicsHelper: MMDPhysicsHelper | undefined;

let mesh: THREE.SkinnedMesh;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: OutlineEffect;

/**
 * 头部
 */
let head: any;

const clock = new THREE.Clock();

const modelFile = "models/kizunaai/kizunaai.pmx";

export interface VtuberOptions {
  /**
   * 加载动画
   */
  withAnimation?: boolean;
}

/**
 * init vtuber mmd
 */
export function initVtuber(
  container: HTMLElement,
  options: VtuberOptions = {}
) {
  window.inited = true;
  const defaultOptions = {
    withAnimation: false,
  };

  options = Object.assign(defaultOptions, options);

  camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 16);

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // grid
  const gridHelper = new THREE.PolarGridHelper(
    30,
    10,
    8,
    64,
    undefined,
    undefined
  );
  gridHelper.position.y = -18;
  scene.add(gridHelper);

  const ambient = new THREE.AmbientLight(0x666666);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0x887766);
  directionalLight.position.set(-1, 1, 1).normalize();
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  effect = new OutlineEffect(renderer, {});

  // STATS
  stats = new (Stats as any)();
  container.appendChild(stats.dom);

  // model
  function onProgress(xhr: ProgressEvent) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(`${xhr.type}: ${Math.round(percentComplete)}% downloaded`);
    }
  }

  helper = new MMDAnimationHelper();

  const mmdLoader = new MMDLoader();
  if (options.withAnimation) {
    const vmdFiles = ["models/mmd/vmds/wavefile_v2.vmd"];
    mmdLoader.loadWithAnimation(
      modelFile,
      vmdFiles,
      (mmd) => {
        mesh = mmd.mesh;
        mesh.position.y = gridHelper.position.y;

        scene.add(mesh);

        helper.add(mesh, { animation: mmd.animation, physics: true });

        createIkHelper();
        createPhysicsHelper();
        bindBones();

        initGui();
      },
      onProgress,
      undefined
    );
  } else {
    mmdLoader.load(modelFile, (object) => {
      mesh = object;
      mesh.position.y = gridHelper.position.y;

      scene.add(mesh);

      helper.add(mesh, { physics: true });

      createIkHelper();
      createPhysicsHelper();
      bindBones();

      initGui();
    });
  }

  function createIkHelper() {
    ikHelper = helper.objects.get(mesh)?.ikSolver.createHelper();

    if (ikHelper) {
      ikHelper.visible = false;
      scene.add(ikHelper);
    }
  }

  function createPhysicsHelper() {
    physics = helper.objects.get(mesh)?.physics;
    physicsHelper = physics?.createHelper();

    if (physicsHelper) {
      physicsHelper.visible = false;
      scene.add(physicsHelper);
    }
  }

  function bindBones() {
    // bind bones
    const bones = physics?.mesh.skeleton.bones;
    if (bones) {
      // 头部
      head = bones[8];
    }
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 100;

  window.addEventListener("resize", onWindowResize, false);

  /**
   * GUI
   */
  function initGui() {
    // 如果已经存在
    const $gui = document.querySelector(".dg.ac");
    if ($gui) return;

    const params = {
      animation: true,
      ik: true,
      outline: true,
      physics: true,
      showIkBones: false,
      showRigidBodies: false,
    };

    GUI.TEXT_OPEN = "打开控制面板";
    GUI.TEXT_CLOSED = "关闭控制面板";
    const gui = new GUI();
    gui
      .add(params, "animation")
      .name("动画")
      .onChange(function () {
        helper.enable("animation", params["animation"]);
      });

    gui
      .add(params, "ik")
      .name("反向动力学")
      .onChange(function () {
        helper.enable("ik", params["ik"]);
      });

    gui
      .add(params, "outline")
      .name("描边")
      .onChange(function () {
        effect.enabled = params["outline"];
      });

    gui
      .add(params, "physics")
      .name("物理")
      .onChange(function () {
        helper.enable("physics", params["physics"]);
      });

    gui
      .add(params, "showIkBones")
      .name("显示骨骼")
      .onChange(() => {
        if (ikHelper) {
          ikHelper.visible = params["showIkBones"];
        }
      });

    gui
      .add(params, "showRigidBodies")
      .name("显示刚体")
      .onChange(function () {
        if (physicsHelper) {
          physicsHelper.visible = params["showRigidBodies"];
        }
      });
  }
}

/**
 * 重新调整窗口大小
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize(window.innerWidth, window.innerHeight);
}

/**
 *
 * @param result 检测数据
 */
function render() {
  helper.update(clock.getDelta());
  effect.render(scene, camera);
}

/**
 *
 * @param result
 */
export function animate(result?: DetectResult) {
  requestAnimationFrame(() => {
    let result;
    if (window.face) {
      result = generateResult();
    } else {
      result = window.vtuberResult;
    }
    animate(result);
  });
  stats.begin();
  if (result) {
    renderWithResult(result);
  } else {
    render();
  }
  stats.end();
}

export function renderWithResult(result: DetectResult) {
  const { mouth } = result;
  if (!mesh.morphTargetInfluences) return;
  const mouthIndex = getMouthIndex(mouth);

  /**
   * 旋转头部
   * @param ratoio 比例
   */
  function rotateHead(ratio = 5) {
    head.rotation.x = result.head.rotation.x * ratio;
    head.rotation.y = result.head.rotation.y * ratio;
    head.rotation.z = result.head.rotation.z * ratio;
  }

  rotateHead();

  if (mouthIndex) {
    mesh.morphTargetInfluences[mouthIndex] = 1;
  }

  render();

  // reset
  if (mouthIndex) {
    mesh.morphTargetInfluences[mouthIndex] = 0;
  }
}

import type { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js'
import type { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import type { CCDIKHelper } from 'three/examples/jsm/animation/CCDIKSolver'
import type {
  MMDPhysicsHelper,
} from 'three/examples/jsm/animation/MMDPhysics'
import { isDev } from '@vtuber/shared'
import { ASSETS } from 'vtuber/utils/cdn'

/**
 * GUI
 */
export async function initGui(helper: MMDAnimationHelper, effect: OutlineEffect, ikHelper: CCDIKHelper | undefined, physicsHelper: MMDPhysicsHelper | undefined) {
  const { GUI } = await import(/* @vite-ignore */isDev ? 'three/examples/jsm/libs/lil-gui.module.min' : ASSETS.GUI.cdn)

  const params = {
    animation: true,
    ik: true,
    outline: true,
    physics: true,
    showIkBones: false,
    showRigidBodies: false,
  }

  GUI.TEXT_OPEN = '打开控制面板'
  GUI.TEXT_CLOSED = '关闭控制面板'

  const gui = new GUI()

  gui
    .add(params, 'animation')
    .name('动画')
    .onChange(() => {
      helper.enable('animation', params.animation)
    })

  gui
    .add(params, 'ik')
    .name('反向动力学')
    .onChange(() => {
      helper.enable('ik', params.ik)
    })

  gui
    .add(params, 'outline')
    .name('描边')
    .onChange(() => {
      effect.enabled = params.outline
    })

  gui
    .add(params, 'physics')
    .name('物理')
    .onChange(() => {
      helper.enable('physics', params.physics)
    })

  gui
    .add(params, 'showIkBones')
    .name('显示骨骼')
    .onChange(() => {
      if (ikHelper)
        ikHelper.visible = params.showIkBones
    })

  gui
    .add(params, 'showRigidBodies')
    .name('显示刚体')
    .onChange(() => {
      if (physicsHelper)
        physicsHelper.visible = params.showRigidBodies
    })

  return gui
}

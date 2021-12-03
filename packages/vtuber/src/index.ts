import consola from 'consola'

import { getScript } from 'vtuber/utils'
import { isDev } from '@vtuber/shared'
import { ASSETS } from 'vtuber/utils/cdn'
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { initVtuber } from './mmd'

export { useVtuber } from './kalidokit'

export * from './types'

// export function main(AmmoLib: any) {
export async function main(container: HTMLDivElement) {
  // Ammo = AmmoLib;
  // 30 25 24 21 20 19 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0

  // happy_eye_close: 0, 2, 3
  // neutral_eye_close: 1, 4, 5
  // blink: none -> 6 -> 1 -> 7 -> 8 -> none

  // mouth: 9 -> 13 -> 14 -> 12 -> 16 -> 17 -> 11
  // teeth: 10 15 21
  // happy: 18 23
  // unhappy: 19 24 25
  // what?: 20

  if (!container) {
    consola.error('Container can not be found!')
    return
  }

  const vtuber = await initVtuber(container)
  // run({ euler: [0, 0, 0], eye: [0, 0] });

  return vtuber
}

export class Vtuber {
  gui: GUI | undefined

  async init(container: HTMLDivElement) {
    const ammoPath = isDev ? ASSETS.Ammo.local : ASSETS.Ammo.cdn
    return new Promise((resolve, reject) => {
      getScript(ammoPath, () => {
        if (self.Ammo) {
          self.Ammo().then(async() => {
            const vtuber = await main(container)
            if (vtuber?.gui)
              this.gui = vtuber.gui

            resolve(this)
          }).catch((e: any) => {
            reject(e)
          })
        }
      })
    })
  }

  destroy() {
    // gui 是被创建的 dom 元素，需要在取消挂载时手动销毁
    this.gui?.destroy()
  }
}

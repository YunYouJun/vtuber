import { getScript } from 'vtuber/utils'
import { isDev } from '@vtuber/shared'
import { ASSETS } from 'vtuber/utils/cdn'
import { animate, initVtuber } from './mmd'

// export function main(AmmoLib: any) {
export function main() {
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

  const container = document.getElementById('vtuber-container')
  if (!container) return
  initVtuber(container)
  // run({ euler: [0, 0, 0], eye: [0, 0] });
  animate()
}

export class Vtuber {
  init() {
    const ammoPath = isDev ? ASSETS.Ammo.local : ASSETS.Ammo.cdn
    getScript(ammoPath, () => {
      if (window.Ammo)
        window.Ammo().then(main)
    })
  }
}

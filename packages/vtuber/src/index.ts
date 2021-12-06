export * from './types'
export { useVtuber } from './kalidokit'

// import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
// async function initAmmo(container: HTMLDivElement) {
//   const ammoPath = isDev ? ASSETS.Ammo.local : ASSETS.Ammo.cdn
//   return new Promise((resolve, reject) => {
//     getScript(ammoPath, () => {
//       if (self.Ammo) {
//         self.Ammo().then(async() => {
//           const vtuber = await main(container)
//           if (vtuber?.gui)
//             this.gui = vtuber.gui

//           resolve(this)
//         }).catch((e: any) => {
//           reject(e)
//         })
//       }
//     })
//   })
// }

// destroy() {
//   // gui 是被创建的 dom 元素，需要在取消挂载时手动销毁
//   this.gui?.destroy()
// }

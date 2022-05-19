import type { DetectResult } from 'vtuber/parse'

declare global {
  interface Window {
    Ammo: any
    /**
     * Vtuber 是否已经被初始化
     */
    inited: boolean
    /**
     * faceapi 相关
     */
    face: {
      points?: { x: number; y: number }[]
    }

    /**
     * Vtuber 数据
     */
    vtuberResult: DetectResult
  }
}

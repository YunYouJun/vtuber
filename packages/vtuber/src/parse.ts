import * as THREE from 'three'
import { Point } from 'face-api.js'
import { FaceMap } from './face'

/**
 * 解析后的检测结果
 */
export interface DetectResult {
  /**
   * 头部旋转角度
   */
  head: {
    rotation: {
      x: number
      y: number
      z: number
    }
  }
  /**
   * 嘴巴张开百分比
   */
  mouth: number
}

interface KeyPoints {
  /**
   * 眉毛中心
   */
  browCenter: Point
  eyeCenter?: Point
  noseCenter: Point
  /**
   * 下巴中心
   */
  jawCenter: Point
}

/**
 * 获取水平旋转量
 * @param keyPoints 关键点
 */
export function getHorizontalRotation(keyPoints: KeyPoints) {
  const { browCenter, noseCenter, jawCenter } = keyPoints
  const midline = browCenter.sub(jawCenter)
  // 上斜边
  const topline = browCenter.sub(noseCenter)
  const midlineVector = new THREE.Vector2(midline.x, midline.y)
  const toplineVector = new THREE.Vector2(topline.x, topline.y)

  const midlineLength = midline.magnitude()

  const rotation
    = midlineVector.cross(toplineVector) / (midlineLength * midlineLength)
  return rotation
}

/**
 * 生成解析后的结果
 */
export function generateResult(): DetectResult | undefined {
  if (!window.face) return
  const points = window.face.points

  const head = {
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  }

  /**
   * 眉毛中心
   */
  const browCenter = points[FaceMap.brow.left[2]]
    .add(points[FaceMap.brow.right[2]])
    .div({ x: 2, y: 2 })
  const noseCenter = points[FaceMap.nose.nostrils[2]]
  const jawCenter = points[FaceMap.jaw[2]]

  const rotation = getHorizontalRotation({
    browCenter,
    noseCenter,
    jawCenter,
  })
  head.rotation.y = rotation

  /**
   * 嘴巴宽度
   */
  const width = points[FaceMap.mouth.upperLip.left]
    .sub(points[FaceMap.mouth.upperLip.right])
    .magnitude()

  /**
   * 张开的高度
   */
  const height = points[FaceMap.mouth.upperLip.bottom[1]]
    .sub(points[FaceMap.mouth.lowerLip.top[1]])
    .magnitude()

  const percent = height / width

  // debug
  // console.log(width, height, percent);

  return {
    head,
    mouth: percent,
  }
}

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
 * 获得水平与垂直旋转量
 * @param keyPoints 
 */
export function getRotation(keyPoints: KeyPoints) {
  const { browCenter, noseCenter, jawCenter } = keyPoints
  const midLine = browCenter.sub(jawCenter)

  // 上斜边
  const topLine = browCenter.sub(noseCenter)
  const midLineVector = new THREE.Vector2(midLine.x, midLine.y)
  const topLineVector = new THREE.Vector2(topLine.x, topLine.y)

  const midLineLength = midLine.magnitude()

  const midLineLengthSquare = midLineLength * midLineLength

  return {
    // 水平 Horizontal x
    x: midLineVector.cross(topLineVector) / midLineLengthSquare,
    // 垂直 Vertical y
    y: midLineVector.dot(topLineVector) / midLineLengthSquare - 0.5
  }
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

  const rotation = getRotation({
    browCenter,
    noseCenter,
    jawCenter,
  })
  head.rotation.y = rotation.x
  head.rotation.x = rotation.y

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

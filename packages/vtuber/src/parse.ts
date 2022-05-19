import * as THREE from 'three'
import { Point } from 'face-api.js'
import { FaceMap } from './face'
import type { IKeyframeTrack, RecordedFrame } from '~/stores/face'

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
    y: midLineVector.dot(topLineVector) / midLineLengthSquare - 0.5,
  }
}

/**
 * 将 dlib 68点数据转换为 序列帧的形式
 */
export function convertRecordedFrameToFrameTrack(data: RecordedFrame[]) {
  const tracks: {
    x: IKeyframeTrack
    y: IKeyframeTrack
  } = {
    x: {
      times: [],
      values: [],
    },
    y: {
      times: [],
      values: [],
    },
  }

  for (let i = 0; i < data.length; i++) {
    const rawFrame = data[i]
    const result = generateResultFromPoints(rawFrame.points.map(point => new Point(point.x, point.y)))

    const time = rawFrame.time / 1000
    tracks.x.times.push(time)
    tracks.y.times.push(time)
    if (result) {
      tracks.x.values.push(result.head.rotation.x)
      tracks.y.values.push(result.head.rotation.y)
    }
  }

  return tracks
}

/**
 * 根据 dlib 68 点位置，生成解析后的结果
 */
export function generateResultFromPoints(points: Point[]): DetectResult | undefined {
  if (!points || !points.length)
    return

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

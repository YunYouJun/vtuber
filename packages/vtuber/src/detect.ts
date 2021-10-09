// detect by face-api.js
// https://github.com/justadudewhohacks/face-api.js

import consola from 'consola'

import * as faceapi from 'face-api.js'
import type { PositionPoint } from 'vtuber/types/index'

/**
 * 加载模型
 */
export async function loadModel() {
  // load face detection and face landmark models
  // await changeFaceDetector(SSD_MOBILENETV1);s
  const weightFolder = '/weights'
  await faceapi.nets.ssdMobilenetv1.loadFromUri(weightFolder)
  await faceapi.loadFaceLandmarkModel(weightFolder)
}

/**
 * 绘制脸部识别结果
 */
export function drawFaceRecognitionResults(
  canvas: HTMLCanvasElement,
  videoEl: HTMLVideoElement,
  results: faceapi.WithFaceLandmarks<
  {
    detection: faceapi.FaceDetection
  },
  faceapi.FaceLandmarks68
  >,
  options = {
    debug: false,
    withBoxes: false,
    withFaceLandmarks: false,
    withLandmarkIndex: false,
  },
) {
  const dims = faceapi.matchDimensions(canvas, videoEl, true)
  const resizedResults = faceapi.resizeResults(results, dims)

  // if (options.debug) consola.log(resizedResults)

  // draw detections
  if (options.withBoxes) faceapi.draw.drawDetections(canvas, resizedResults)

  if (options.withFaceLandmarks) {
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
    // draw text number
    const points = resizedResults.landmarks.positions
    // 挂载到全局，store 管理速度似乎太慢
    window.face = {
      enable: true,
      points,
    }

    // 绘制索引点序号
    if (options.withLandmarkIndex) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.font = '10px serif'
      points.forEach((point: PositionPoint, i: number) => {
        ctx.fillText(i.toString(), point.x, point.y)
      })
    }
  }
}

// detect by face-api.js
// https://github.com/justadudewhohacks/face-api.js

import * as faceapi from "face-api.js";

/**
 * 加载模型
 */
export async function loadModel() {
  // load face detection and face landmark models
  // await changeFaceDetector(SSD_MOBILENETV1);s
  const weightFolder = "/weights";
  await faceapi.nets.ssdMobilenetv1.loadFromUri(weightFolder);
  await faceapi.loadFaceLandmarkModel(weightFolder);
}

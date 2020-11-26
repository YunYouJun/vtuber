/**
 * 改变 WebCam 流
 * @param {*} facingMode 模式
 */
export async function changeWebcamStream(facingMode) {
  const constraints = {
    video: {
      facingMode,
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const videoEl = document.getElementById("webcam");
  videoEl.srcObject = stream;
}

// maybe i will use `https://vueuse.org/core/useUserMedia/` instead of this
/**
 * Webcam
 * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
 */
export class Webcam {
  stream?: MediaStream
  settings?: MediaTrackSettings

  constructor(
    /**
     * Video Element
     */
    public videoEl: HTMLVideoElement,
    /**
     * 是否使用前置摄像头
     */
    public front = false,
    public constraints: MediaStreamConstraints = {
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: front ? 'user' : 'environment',
      },
    },
  ) {}

  /**
   * 初始化
   */
  async init() {
    await this.changeWebcamStream()
  }

  /**
   * 改变 WebCam 流
   */
  async changeWebcamStream(front = false) {
    this.front = front;
    (this.constraints.video as MediaTrackConstraints).facingMode = front
      ? 'user'
      : 'environment'

    const constraints = this.constraints
    this.stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.settings = this.stream.getVideoTracks()[0].getSettings()

    this.videoEl.srcObject = this.stream
    // autoplay
    this.videoEl.onloadedmetadata = () => {
      this.videoEl.play()
    }
  }
}

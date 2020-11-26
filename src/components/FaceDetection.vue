<template>
  <div id="rects"></div>
  <video
    id="webcam"
    ref="webcamVideo"
    width="1280"
    height="720"
    autoplay
    controls
  ></video>
  <canvas id="overlay" ref="overlay"></canvas>
</template>

<script>
import * as faceapi from "face-api.js";
import { changeWebcamStream } from "../lib/js/webcam";
export default {
  data() {
    return {
      videoEl: null,
      overlay: null,

      minConfidence: 0.5,
      withBoxes: true,
    };
  },

  async mounted() {
    await this.loadModel();

    this.videoEl = this.$refs.webcamVideo;
    this.overlay = this.$refs.overlay;

    this.initWebcam();
  },

  methods: {
    async loadModel() {
      // load face detection and face landmark models
      // await changeFaceDetector(SSD_MOBILENETV1);s
      const weightFolder = "/weights";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(weightFolder);
      await faceapi.loadFaceLandmarkModel(weightFolder);

      faceapi;
    },

    /**
     * 初始化 Webcam
     */
    async initWebcam() {
      await changeWebcamStream();
      const videoEl = this.videoEl;
      videoEl.onloadedmetadata = () => {
        this.onPlay();
      };
    },

    async onPlay() {
      const videoEl = this.videoEl;
      if (!videoEl) return;

      if (videoEl.paused || videoEl.ended)
        return setTimeout(() => this.onPlay(), 100);

      const options = new faceapi.SsdMobilenetv1Options({
        minConfidence: this.minConfidence,
      });

      const results = await faceapi
        .detectAllFaces(videoEl, options)
        .withFaceLandmarks();

      const canvas = this.overlay;
      if (results && canvas) {
        this.drawFaceRecognitionResults(results);
      }

      setTimeout(() => this.onPlay());
    },

    drawFaceRecognitionResults(results) {
      const videoEl = this.videoEl;
      const canvas = this.overlay;

      const dims = faceapi.matchDimensions(canvas, videoEl, true);
      const resizedResults = faceapi.resizeResults(results, dims);

      if (this.withBoxes) {
        faceapi.draw.drawDetections(canvas, resizedResults);
      }
      faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
    },
  },
};
</script>

<style lang="scss">
video {
  position: absolute;
  left: 0px;
  top: 0px;
}

#rects {
  position: relative;
}

.rect {
  position: absolute;
  border: 2px dashed;
}

.text {
  font-size: 1em;
  padding: 5px;
  @media screen and (max-width: 600px) {
    font-size: 0.8em;
  }
}
</style>

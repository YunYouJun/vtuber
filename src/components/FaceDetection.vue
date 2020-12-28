<template>
  <div :class="['video-container', flip ? 'flip' : '']">
    <video
      id="webcam"
      class="video-card"
      ref="webcamVideo"
      autoplay
      controls
    ></video>
    <canvas id="overlay" class="webcam-overlay" ref="overlay"></canvas>
  </div>
  <div class="video-control">
    <button class="agm-button" @click="debug = !debug">DEBUG</button>
    <button class="agm-button" @click="flip = !flip">翻转</button>
    <button class="agm-button" @click="withFaceLandmarks = !withFaceLandmarks">
      标记
    </button>
    <button class="agm-button" @click="withLandmarkIndex = !withLandmarkIndex">
      索引
    </button>
  </div>
</template>

<script>
import * as faceapi from "face-api.js";
import { Webcam } from "../lib/webcam";
export default {
  data() {
    return {
      debug: false,

      webcam: null,

      videoEl: null,
      overlay: null,
      ctx: null,

      minConfidence: 0.5,
      withBoxes: false,
      withFaceLandmarks: true,
      withLandmarkIndex: true,

      flip: false,
    };
  },

  async mounted() {
    await this.loadModel();

    this.videoEl = this.$refs.webcamVideo;
    this.overlay = this.$refs.overlay;
    this.ctx = this.overlay.getContext("2d");
    this.ctx.font = "100px serif";

    this.initWebcam();
  },

  methods: {
    async loadModel() {
      // load face detection and face landmark models
      // await changeFaceDetector(SSD_MOBILENETV1);s
      const weightFolder = "/weights";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(weightFolder);
      await faceapi.loadFaceLandmarkModel(weightFolder);
    },

    /**
     * 初始化 Webcam
     */
    async initWebcam() {
      const videoEl = this.videoEl;
      this.webcam = new Webcam(videoEl);
      await this.webcam.init();

      this.videoEl.onloadedmetadata = () => {
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

      // we only need single face
      // .detectAllFaces(videoEl, options)
      const results = await faceapi
        .detectSingleFace(videoEl, options)
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

      if (this.debug) {
        console.log(resizedResults);
      }

      // draw detections
      if (this.withBoxes) {
        faceapi.draw.drawDetections(canvas, resizedResults);
      }

      if (this.withFaceLandmarks) {
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
        // draw text number
        const points = resizedResults.landmarks.positions;
        this.$store.commit("face/setPoints", points);

        if (this.withLandmarkIndex) {
          points.forEach((point, i) => {
            this.ctx.fillText(i, point.x, point.y);
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
video {
  outline: none;
}

.video-container {
  position: relative;
  width: 640px;
  height: 360px;
  margin: 0 auto;
}

.video-card {
  border-radius: 5px;
}

#webcam {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
}

.webcam-overlay {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
}

.flip {
  transform: rotateY(180deg);
}

// augma
.agm-button {
  padding: 0.5rem 1rem;
  margin: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid black;
  background: white;
}
</style>

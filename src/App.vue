<template>
  <face-detection />
  <vtuber-canvas />
</template>

<script>
import FaceDetection from "./components/FaceDetection.vue";
import VtuberCanvas from "./components/VtuberCanvas.vue";

export default {
  name: "App",
  components: {
    FaceDetection,
    VtuberCanvas,
  },
};
</script>

<template>
  <face-detection />
  <vtuber-canvas />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import FaceDetection from "../components/FaceDetection.vue";
import VtuberCanvas from "../components/VtuberCanvas.vue";

export default defineComponent({
  name: "App",
  components: {
    FaceDetection,
    VtuberCanvas,
  },
});
</script>

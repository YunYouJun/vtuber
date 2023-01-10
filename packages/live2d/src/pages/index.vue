<script setup lang="ts">
import { main } from '~/utils/live2d'

onMounted(() => {
  main()
})
</script>

<template>
  <video class="input_video" width="1280px" height="720px" />
  <div class="preview">
    <canvas class="guides" />
    <section>
      <a class="current" href="/live2d/"><p>Live2D</p></a>
    </section>
  </div>
  <canvas id="live2d" />
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style lang="scss">
video {
  position: absolute;
  right: 0;
  bottom: 0;

  width: 200px;
  height: auto;
  transform: scale(-1, 1);
}

.guides {
  position: absolute;
  bottom: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 1;
}

a,
a:visited,
a:link {
  text-decoration: none;
  color: #222;
  display: inline-block;
}
a:hover,
a:visited:hover,
a:link:hover {
  color: #13a3f3;
  cursor: pointer;
}

.preview {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 16px;
  right: 16px;
  overflow: hidden;
  border-radius: 8px;
}
video {
  max-width: 400px;
  height: auto;
  transform: scale(-1, 1);
  opacity: 0.5;
}
.preview canvas {
  transform: scale(-1, 1);
}
body {
  margin: 0;
}
canvas {
  display: block;
}
.guides {
  position: absolute;
  bottom: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 1;
}
section {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 32px 0 16px 0;
  display: flex;
  justify-content: center;
  width: 100%;
  background: rgb(0, 0, 0);
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  color: white;
  z-index: 2;
    /* border-radius: 40px; */
}
p {
  color: white;
  padding: 8px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",
      sans-serif;
  margin: 0;
}
.preview a {
  border-radius: 24px;
  margin: 0 4px;
}
.preview a:hover {
  background: #ffffff20;
}
a.current {
  background: #13a3f3;
  pointer-events: none;
}

.linkOut {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: inline;
  color: black;
  padding: 0;
}
</style>

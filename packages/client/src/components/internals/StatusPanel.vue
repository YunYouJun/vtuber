<template>
  <div class="p-2 shadow rounded absolute top-2 left-2">
    FPS: {{ fps }}
  </div>
</template>

<script lang="ts" setup>
const fps = useFps()
</script>

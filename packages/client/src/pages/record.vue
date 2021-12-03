<template>
  <FaceDetection />
  <div
    class="
      absolute
      bottom-0
      left-0
      transition
      duration-300
      opacity-0
      hover:opacity-100
      shadow-dark-900
    "
    :class="[presistNav ? 'opacity-100 right-0' : 'opacity-0 p-2']"
  >
    <NavControls />
  </div>
</template>

<script lang="ts" setup>
const presistNav = ref(true)
</script>

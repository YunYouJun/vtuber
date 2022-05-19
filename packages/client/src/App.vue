<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { isClient } from '@vueuse/core'

useHead({
  title: 'Vtuber',
  meta: [{ name: 'description', content: '从一开始的 Vtuber' }],
})

if (isClient)
  self.face = {}
</script>

<template>
  <router-view />
</template>

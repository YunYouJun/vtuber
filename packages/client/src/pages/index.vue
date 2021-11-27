<script setup lang="ts">
import { isDev } from '@vtuber/shared'
import consola from 'consola'

if (isDev) consola.info('当前处于开发模式下...')
</script>

<template>
  <div class="home text-center mt-10">
    <i-ri-ghost-line class="text-8xl" />
    <h2 class="m-2 text-xl" font="black">从一开始的 Vtuber</h2>

    <blockquote class="mt-2 text-lg">Vtuber 试验场</blockquote>

    <a class="icon-btn" href="https://docs.vtuber.yunyoujun.cn" target="_blank" title="开发笔记">
      <i-ri-book-line />
    </a>
  </div>
</template>

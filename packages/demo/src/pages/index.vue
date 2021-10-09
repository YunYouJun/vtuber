<template>
  <div class="home text-center mt-10">
    <img class="m-auto w-40" src="/favicon.svg" />
    <h2>从一开始的 Vtuber</h2>

    <blockquote>Vtuber 试验场</blockquote>

    <a href="https://docs.vtuber.yunyoujun.cn" target="_blank">开发笔记</a>
    <a href="/vtuber">3D 预览示例</a>
  </div>
</template>

<script setup lang="ts">
import { isDev } from '@vtuber/shared'
import consola from 'consola'

if (isDev) consola.info('当前处于开发模式下...')
</script>

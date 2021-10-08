---
title: 首页
---

<div class="home text-center mt-10">
  <img class="m-auto w-40" src="/favicon.svg" />

# 从一开始的 Vtuber

</div>

> Vtuber 试验场

- <a href="https://docs.vtuber.yunyoujun.cn" target="_blank">开发笔记</a>
- [3D 预览示例](/vtuber)

<script setup lang="ts">
import { isDev } from '@vtuber/shared'
import consola from 'consola'
import pkg from '../../package.json'

if (isDev) consola.info('当前处于开发模式下...')
</script>

<script lang="ts" setup>
import { modelList } from '@vtuber/shared'
import { useVtuberStore } from '~/stores/vtuber'

const vtuberStore = useVtuberStore()

function setCurModelUrl(url: string) {
  vtuberStore.curModelUrl = url
}
</script>

<template>
  <div class="toggle-model absolute top-5">
    <div v-for="(item, i) in modelList" :key="i" class="inline-flex cursor-pointer shadow" m="x-1" @click="setCurModelUrl(item.url)">
      <img class="w-15 rounded" :src="item.icon" :title="item.name">
    </div>
  </div>
</template>

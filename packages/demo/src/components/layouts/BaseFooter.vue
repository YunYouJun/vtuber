<template>
  <hr class="my-5" />
  <vue-about-me :copyright="copyright" :is-dark="isDark"></vue-about-me>
</template>

<script setup lang="ts">
import VueAboutMe from 'vue-about-me'
import { isDark } from '~/logic'

import pkg from '~/../../../package.json'

import 'vue-about-me/style.css'

const copyright = {
  name: 'Vtuber',
  repo: 'vtuber',
  author: pkg.author.name,
  link: 'https://sponsors.yunyoujun.cn',
}
</script>

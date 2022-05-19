<script setup lang="ts">
import * as pkg from '~/../package.json'
import { isDark, toggleDark } from '~/composables'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav class="text-xl my-5">
    <router-link
      active-class="text-blue-500"
      class="icon-btn mx-1"
      to="/"
      :title="t('button.home')"
    >
      <i-ri-body-scan-line />
    </router-link>

    <router-link class="icon-btn mx-2" to="/2d">
      <i-ri-camera-line />
    </router-link>

    <router-link
      class="icon-btn mx-1"
      active-class="text-blue-500"
      to="/about"
      :title="t('button.about')"
    >
      <i-ri-file-info-line />
    </router-link>

    <a
      class="icon-btn mx-1"
      rel="noreferrer"
      :href="pkg.repository.url"
      target="_blank"
      title="GitHub"
    >
      <i-ri-github-line />
    </a>

    <button
      class="icon-btn mx-1 !outline-none"
      :title="t('button.toggle_dark')"
      @click="toggleDark()"
    >
      <i-ri-moon-line v-if="isDark" />
      <i-ri-sun-line v-else />
    </button>

    <a class="icon-btn mx-1" :title="t('button.toggle_langs')" @click="toggleLocales">
      <i-ri-translate />
    </a>
  </nav>
</template>

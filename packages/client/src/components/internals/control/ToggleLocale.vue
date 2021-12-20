<template>
  <IconButton :title="t('button.toggle_langs')" @click="toggleLocales">
    <i-ri-translate class="transform" :class="isEn ? 'rotate-y-180' : ''" />
  </IconButton>
</template>

<script lang="ts" setup>
const { t, availableLocales, locale } = useI18n()

const isEn = computed(() => locale.value === 'en')

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

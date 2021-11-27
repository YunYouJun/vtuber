<template>
  <button
    class="vtb-icon-button m-1 shadow hover:shadow-lg"
    :class="[active ? 'is-active' : '']"
    :title="title"
    :aria-label="title"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

withDefaults(defineProps<{ active?: boolean; title?: string }>(), {
  title: '',
  active: false,
})
</script>

<style lang="scss">
.vtb-icon-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  outline: none;

  border-radius: 50%;

  width: 2.5rem;
  height: 2.5rem;

  transition: 0.2s;

  @apply bg-gray-100 bg-opacity-90 dark:bg-gray-800;

  &:focus {
    outline: none;
  }

  &:active,
  &.is-active {
    @apply text-white bg-black dark:(bg-white text-black);
  }
}
</style>

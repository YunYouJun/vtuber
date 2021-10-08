<template>
  <button
    :class="['vtb-icon-button', 'm-1', active ? 'is-active' : '']"
    :title="title"
    :aria-label="title"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

withDefaults(defineProps<{ active: boolean; title: string }>(), {
  title: '',
  active: true,
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
  border: 1px solid gray;

  transition: 0.2s;

  &:hover {
    border-color: black;
  }

  &:focus {
    outline: none;
  }

  &:active,
  &.is-active {
    color: white;
    background-color: black;
  }
}
</style>

<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean, title?: string }>(), {
  title: '',
  active: false,
})
</script>

<template>
  <button
    class="vtb-icon-button tooltip m-1 shadow hover:shadow-lg"
    :class="[active ? 'is-active' : '']"
    :title="title"
    :aria-label="title"
  >
    <slot />
    <span v-if="title" class="tooltip-text whitespace-nowrap" text="sm">{{ title }}</span>
  </button>
</template>

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

  &[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* Tooltip container */
.tooltip {
  position: relative;
}

/* Tooltip text */
.tooltip .tooltip-text {
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: 125%;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>

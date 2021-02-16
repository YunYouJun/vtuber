<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav>
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-8 w-auto"
              src="https://www.yunyoujun.cn/yun.svg"
              alt="Workflow"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="https://www.yunyoujun.cn/yun.svg"
              alt="Workflow"
            />
          </div>
          <div class="sm:block sm:ml-6">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <router-link
                v-for="(navItem, i) in navItems"
                :key="i"
                href="#"
                :class="
                  (isActive(navItem.name)
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-700 hover:text-white') +
                  ' px-3 py-2 rounded-md text-sm font-medium'
                "
                :to="navItem.to"
                >{{ navItem.title }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    navItems: {
      type: Array,
      default() {
        return [
          {
            name: "Home",
            title: "主页",
            to: "/",
          },
          {
            name: "Vtuber",
            title: "Vtuber Demo",
            to: "/vtuber",
          },
          {
            name: "Webcam",
            title: "Webcam",
            to: "/webcam",
          },
        ];
      },
    },
  },
  mounted() {
    this.isActive("vtuber");
  },
  methods: {
    isActive(name: string) {
      return this.$route.name === name;
    },
  },
});
</script>

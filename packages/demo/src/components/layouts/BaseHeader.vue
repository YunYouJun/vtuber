<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    router
  >
    <el-menu-item index="/">
      <div class="flex h-full justify-center items-center">
        <img
          class="flex w-auto h-8"
          src="https://www.yunyoujun.cn/yun.svg"
          alt="Workflow"
        />
      </div>
    </el-menu-item>
    <el-menu-item v-for="(item, i) in navItems" :key="i" :index="item.to">
      {{
        item.title
      }}
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface NavItem {
  name: string
  title: string
  to: string
}

export default defineComponent({
  data() {
    return {
      activeIndex: '/',
      navItems: [
        {
          name: 'Vtuber',
          title: 'Vtuber Demo',
          to: '/vtuber',
        },
        {
          name: 'Webcam',
          title: 'Webcam',
          to: '/webcam',
        },
      ],
    }
  },
})
</script>

import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import mk from 'markdown-it-katex'
// eslint-disable-next-line antfu/no-import-node-modules-by-path
import { baseConfig } from '../node_modules/vitepress-theme-you/src/config'

export default defineConfig({
  extends: baseConfig,

  title: 'Docs for Vtuber',
  description: '从一开始的 Vtuber',

  themeConfig: {
    logo: {
      light: '/favicon.svg',
      dark: '/favicon.dark.svg',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunYouJun/vitepress-theme-you' },
    ],

    // iconClass: 'i-ri-ghost-line',

    nav: [{ text: '在线示例', link: 'https://vtuber.yunyoujun.cn' }],

    sidebar: {
      '/guide/': getGuideSidebar(),
    },

    footer: {
      copyright: 'Copyright © 2020 YunYouJun',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'YunYouJun' }],
  ],

  markdown: {
    config: (md) => {
      md.use(mk)
    },
  },
})

/**
 * 获取导航侧边栏
 */
function getGuideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '指南',
      items: [
        { text: 'Why Web VTuber?', link: '/guide/index' },
        { text: '开始', link: '/guide/start' },
        { text: 'VRM', link: '/guide/vrm' },
        { text: '扩展功能', link: '/guide/extensions' },
        { text: '参考', link: '/guide/ref' },
        { text: '细节', link: '/guide/details' },
        { text: '解决方案', link: '/guide/solutions' },
        { text: 'FAQ', link: '/guide/faq' },
      ],
    },
  ]
}

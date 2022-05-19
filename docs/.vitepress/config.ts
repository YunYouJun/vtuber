import type { UserConfig } from 'vitepress'
import baseConfig from 'vitepress-theme-you/config'

import mk from 'markdown-it-katex'

const config: UserConfig = {
  extends: baseConfig,

  title: 'Docs for Vtuber',
  description: '从一开始的 Vtuber',
  themeConfig: {
    repo: 'YunYouJun/vtuber',
    logo: '/favicon.svg',
    iconClass: 'i-ri-ghost-line',

    docsBranch: 'main',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: '帮助咱们改善文档！',
    lastUpdated: '上次更新',

    nav: [{ text: '在线示例', link: 'https://vtuber.yunyoujun.cn' }],

    sidebar: {
      '/guide/': getGuideSidebar(),
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
}

export default config

/**
 * 获取导航侧边栏
 */
function getGuideSidebar() {
  return [
    {
      text: '指南',
      children: [
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

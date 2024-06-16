import type { Theme } from 'vitepress'
// import { VPTheme } from 'vitepress-theme-you'

// default theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import './styles/index.scss'
import './styles/katex.scss'

import 'uno.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  // eslint-disable-next-line unused-imports/no-unused-vars
  enhanceApp: ({ app, router, siteData }) => {
    // ...
  },
} satisfies Theme

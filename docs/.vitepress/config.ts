import { UserConfig } from "vitepress";

const config: UserConfig = {
  title: "Docs for Vtuber",
  description: "从一开始的 Vtuber",
  themeConfig: {
    repo: "YunYouJun/vtuber",
    logo: "/favicon.svg",
    docsBranch: "main",
    docsDir: "docs",

    editLinks: true,
    editLinkText: "帮助咱们改善文档！",
    lastUpdated: "上次更新",

    nav: [{ text: "在线示例", link: "https://vtuber.yunyoujun.cn" }],

    sidebar: {
      "/guide/": getGuideSidebar(),
    },
  },

  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    ["meta", { name: "author", content: "YunYouJun" }],
  ],

  markdown: {
    config: (md) => {
      md.use(require('markdown-it-katex'))
    }
  },
}

export default config;

/**
 * 获取导航侧边栏
 */
function getGuideSidebar() {
  return [
    {
      text: "指南",
      children: [
        { text: "Why Web VTuber?", link: "/guide/index" },
        { text: "开始", link: "/guide/start" },
        { text: "扩展功能", link: "/guide/extensions" },
        { text: "参考", link: "/guide/ref" },
      ],
    },
  ];
}

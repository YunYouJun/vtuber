import { UserConfig } from "vitepress";

export default {
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
} as UserConfig;

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
        { text: "参考", link: "/guide/ref" },
      ],
    },
  ];
}

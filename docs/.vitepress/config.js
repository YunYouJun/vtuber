/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: "Docs for Vtuber",
  description: "从一开始的 Vtuber",
  themeConfig: {
    repo: "YunYouJun/vtuber",
    docsBranch: "main",
    docsDir: "docs",

    editLinks: true,
    editLinkText: "帮助咱们改善文档！",
    lastUpdated: "上次更新",

    sidebar: {
      "/guide/": getGuideSidebar(),
    },
  },

  head: [
    ["link", { rel: "icon", href: "/logo.png", type: "image/png" }],
    ["meta", { name: "author", content: "YunYouJun" }],
  ],
};

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
